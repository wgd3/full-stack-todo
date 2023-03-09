import { ServerFeatureTodoModule } from '@fst/server/feature-todo';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';

import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        DATABASE_PATH: Joi.string().default('tmp/db.sqlite'),
      }),
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (config: ConfigService) => {
        const env = config.get('ENVIRONMENT') ?? 'development';
        if (env === 'docker') {
          console.log(
            `Detected Docker environment, connecting to docker DB: ${config.get(
              'DATABASE_HOST'
            )}`
          );
          return {
            type: config.get('DATABASE_TYPE'),
            host: config.get('DATABASE_HOST'),
            username: config.get('DATABASE_USERNAME'),
            password: config.get('DATABASE_PASSWORD'),
            port: config.get('DATABASE_PORT'),
            database: config.get('DATABASE_NAME'),
            synchronize: true,
            logging: true,
            autoLoadEntities: true,
          } as TypeOrmModuleAsyncOptions; // HERES THE PROBLEM
        }
        // default to local devl
        console.log(`Using SQLite for local dev environment`);
        return {
          type: 'sqlite',
          database: config.get('DATABASE_PATH'),
          synchronize: true,
          logging: true,
          autoLoadEntities: true,
        };
      },
      inject: [ConfigService],
    }),
    ServerFeatureTodoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
