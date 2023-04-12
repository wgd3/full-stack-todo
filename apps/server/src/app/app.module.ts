import { ServerFeatureTodoModule } from '@fst/server/feature-todo';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { TypeOrmModule } from '@nestjs/typeorm';

import { ServerFeatureAuthModule } from '@fst/server/feature-auth';
import { ServerFeatureHealthModule } from '@fst/server/feature-health';
import {
  DatabaseExceptionFilter,
  JwtAuthGuard,
  TypeormConfigService,
  appConfig,
  dbConfig,
  validationSchema,
} from '@fst/server/util';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      ignoreEnvVars: true,
      validationSchema,
      load: [appConfig, dbConfig],
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeormConfigService,
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
