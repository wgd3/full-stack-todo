import { ServerDataAccessTodoModule } from '@fst/server/data-access';
import { ServerFeatureUserModule } from '@fst/server/feature-user';
import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt-strategy.service';
import { ServerFeatureAuthController } from './server-feature-auth.controller';
import { ServerFeatureAuthService } from './server-feature-auth.service';

@Module({
  imports: [
    ConfigModule,
    forwardRef(() => ServerFeatureUserModule),
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow<string>('JWT_SECRET'),
        signOptions: {
          expiresIn:
            config.get<string>('JWT_ACCESS_TOKEN_EXPIRES_IN') || '600s',
        },
      }),
      inject: [ConfigService],
    }),
    PassportModule,
    ServerDataAccessTodoModule,
  ],
  controllers: [ServerFeatureAuthController],
  providers: [ServerFeatureAuthService, JwtStrategy],
  exports: [ServerFeatureAuthService],
})
export class ServerFeatureAuthModule {}
