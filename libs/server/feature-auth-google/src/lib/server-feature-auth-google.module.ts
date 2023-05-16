import { Module } from '@nestjs/common';
import { ServerFeatureAuthGoogleController } from './server-feature-auth-google.controller';
import { ServerFeatureAuthGoogleService } from './server-feature-auth-google.service';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { ServerFeatureAuthModule } from '@fst/server/feature-auth';

@Module({
  imports: [ServerFeatureAuthModule],
  controllers: [ServerFeatureAuthGoogleController],
  providers: [ServerFeatureAuthGoogleService],
  exports: [ServerFeatureAuthGoogleService],
})
export class ServerFeatureAuthGoogleModule {}
