import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';

import { ServerFeatureHealthController } from './server-feature-health.controller';

@Module({
  imports: [TerminusModule],
  controllers: [ServerFeatureHealthController],
  providers: [],
  exports: [],
})
export class ServerFeatureHealthModule {}
