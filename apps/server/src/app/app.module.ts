import { ServerFeatureTodoModule } from '@fst/server/feature-todo';
import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';

import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';

import { ServerFeatureAuthModule } from '@fst/server/feature-auth';
import { ServerFeatureHealthModule } from '@fst/server/feature-health';
import { JwtAuthGuard } from '@fst/server/util';
import { APP_GUARD } from '@nestjs/core';
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
        const dbType = config.getOrThrow('DATABASE_TYPE');
        const dbName = config.getOrThrow('DATABASE_NAME');
        Logger.debug(`Detected environment: ${env}`);
        Logger.debug(`Attempting connection to ${dbType} database '${dbName}'`);
        return {
          type: dbType,
          host: config.get('DATABASE_HOST'),
          username: config.get('DATABASE_USERNAME'),
          password: config.get('DATABASE_PASSWORD'),
          port: config.get('DATABASE_PORT'),
          database: dbName,
          synchronize: true,
          logging: true,
          autoLoadEntities: true,
        } as TypeOrmModuleAsyncOptions; // HERES THE PROBLEM
      },
      inject: [ConfigService],
    }),
    ServerFeatureTodoModule,
    ServerFeatureHealthModule,
    ServerFeatureAuthModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
