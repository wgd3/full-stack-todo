import { ServerDataAccessTodoModule } from '@fst/server/data-access';
import { Module } from '@nestjs/common';
import { ServerFeatureUserController } from './server-feature-user.controller';
import { ServerFeatureUserService } from './server-feature-user.service';

@Module({
  imports: [ServerDataAccessTodoModule],
  controllers: [ServerFeatureUserController],
  providers: [ServerFeatureUserService],
  exports: [ServerFeatureUserService],
})
export class ServerFeatureUserModule {}
