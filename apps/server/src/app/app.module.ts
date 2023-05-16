import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { ServerFeatureAuthModule } from '@fst/server/feature-auth';
import { ServerFeatureAuthGoogleModule } from '@fst/server/feature-auth-google';
import { ServerFeatureHealthModule } from '@fst/server/feature-health';
import { ServerFeatureTodoModule } from '@fst/server/feature-todo';
import { ServerFeatureUserModule } from '@fst/server/feature-user';
import {
  DatabaseExceptionFilter,
  JwtAuthGuard,
  TypeormConfigService,
  appConfig,
  dbConfig,
  googleConfig,
  validationSchema,
} from '@fst/server/util';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      ignoreEnvVars: true,
      validationSchema,
      load: [appConfig, dbConfig, googleConfig],
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeormConfigService,
      inject: [ConfigService],
    }),
    ServerFeatureTodoModule,
    ServerFeatureHealthModule,
    ServerFeatureAuthModule,
    ServerFeatureUserModule,
    ServerFeatureAuthGoogleModule,
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
