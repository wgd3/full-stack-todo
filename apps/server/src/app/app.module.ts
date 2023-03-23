import { ServerFeatureTodoModule } from '@fst/server/feature-todo';
import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';

import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';

import { ServerFeatureAuthModule } from '@fst/server/feature-auth';
import { ServerFeatureHealthModule } from '@fst/server/feature-health';
import { DatabaseExceptionFilter, JwtAuthGuard } from '@fst/server/util';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      ignoreEnvVars: true,
      validationSchema: Joi.object({
        DATABASE_PATH: Joi.string().default('tmp/development.sqlite'),
        DATABASE_LOGGING_ENABLED: Joi.boolean().default(false),
        ENVIRONMENT: Joi.string().default('development'),
        NODE_ENV: Joi.string().default('development'),
      }),
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (config: ConfigService) => {
        const env = config.get('ENVIRONMENT') ?? 'development';
        const dbType = config.getOrThrow('DATABASE_TYPE');
        const dbName = config.getOrThrow('DATABASE_NAME');
        const dbPath = config.getOrThrow('DATABASE_PATH');
        const dbLogging = !!config.get('DATABASE_LOGGING_ENABLED');
        Logger.debug(`Detected environment: ${env}`);
        Logger.debug(
          `Attempting connection to ${dbType} database '${
            dbType === 'sqlite' ? dbPath : dbName
          }' (logging: ${dbLogging})`
        );
        return {
          type: dbType,
          host: config.get('DATABASE_HOST'),
          username: config.get('DATABASE_USERNAME'),
          password: config.get('DATABASE_PASSWORD'),
          port: config.get('DATABASE_PORT'),
          database: dbType === 'sqlite' ? dbPath : dbName,
          synchronize: true,
          logging: dbLogging,
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
    {
      provide: APP_FILTER,
      useClass: DatabaseExceptionFilter,
    },
  ],
})
export class AppModule {}
