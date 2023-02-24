import { ITodo } from '@fst/shared/domain';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { CreateTodoDto, UpdateTodoDto, UpsertTodoDto } from './dtos/todo.dto';
import { ServerFeatureTodoService } from './server-feature-todo.service';

@Controller({ path: 'todos' })
export class ServerFeatureTodoController {
  constructor(private serverFeatureTodoService: ServerFeatureTodoService) {}

  @Get('')
  getAll(): ITodo[] {
    return this.serverFeatureTodoService.getAll();
  }

  @Get(':id')
  getOne(@Param('id') id: string): ITodo {
    return this.serverFeatureTodoService.getOne(id);
  }

  @Post('')
  create(@Body() data: CreateTodoDto): ITodo {
    return this.serverFeatureTodoService.create(data);
  }

  @Put(':id')
  upsertOne(@Body() data: UpsertTodoDto): ITodo {
    return this.serverFeatureTodoService.upsert(data);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: UpdateTodoDto): ITodo {
    return this.serverFeatureTodoService.update(id, data);
  }

  @Delete(':id')
  delete(@Param('id') id: string): void {
    return this.serverFeatureTodoService.delete(id);
  }
}
