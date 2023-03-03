import { ServerDataAccessTodoModule } from '@fst/server/data-access-todo';
import { Module } from '@nestjs/common';
import { ServerFeatureTodoController } from './server-feature-todo.controller';
import { ServerFeatureTodoService } from './server-feature-todo.service';

@Module({
  imports: [ServerDataAccessTodoModule],
  controllers: [ServerFeatureTodoController],
  providers: [ServerFeatureTodoService],
  exports: [ServerFeatureTodoService],
})
export class ServerFeatureTodoModule {}
