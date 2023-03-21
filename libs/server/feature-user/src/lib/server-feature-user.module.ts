import { Module } from '@nestjs/common';
import { ServerFeatureUserController } from './server-feature-user.controller';
import { ServerFeatureUserService } from './server-feature-user.service';

@Module({
  controllers: [ServerFeatureUserController],
  providers: [ServerFeatureUserService],
  exports: [ServerFeatureUserService],
})
export class ServerFeatureUserModule {}
