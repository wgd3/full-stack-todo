import { Module } from '@nestjs/common';
import { ServerFeatureAuthController } from './server-feature-auth.controller';
import { ServerFeatureAuthService } from './server-feature-auth.service';

@Module({
  controllers: [ServerFeatureAuthController],
  providers: [ServerFeatureAuthService],
  exports: [ServerFeatureAuthService],
})
export class ServerFeatureAuthModule {}
