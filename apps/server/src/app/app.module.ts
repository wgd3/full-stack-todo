import { ServerFeatureTodoModule } from '@fst/server/feature-todo';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';

import { TypeOrmModule } from '@nestjs/typeorm';

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
      useFactory: (config: ConfigService) => ({
        type: 'sqlite',
        database: config.get('DATABASE_PATH'),
        synchronize: true,
        logging: true,
        autoLoadEntities: true,
      }),
      inject: [ConfigService],
    }),
    ServerFeatureTodoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
