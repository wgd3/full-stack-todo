import { Module } from '@nestjs/common';
import { ServerFeatureTodoController } from './server-feature-todo.controller';
import { ServerFeatureTodoService } from './server-feature-todo.service';

@Module({
  controllers: [ServerFeatureTodoController],
  providers: [ServerFeatureTodoService],
  exports: [ServerFeatureTodoService],
})
export class ServerFeatureTodoModule {}
