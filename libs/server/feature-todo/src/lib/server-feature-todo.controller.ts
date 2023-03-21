import {
  CreateTodoDto,
  TodoDto,
  UpdateTodoDto,
  UpsertTodoDto,
} from '@fst/server/data-access';
import { QueryErrorFilter } from '@fst/server/util';
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
  UseFilters,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { ServerFeatureTodoService } from './server-feature-todo.service';

@Controller({ path: 'todos', version: '1' })
@UseFilters(new QueryErrorFilter())
export class ServerFeatureTodoController {
  constructor(private serverFeatureTodoService: ServerFeatureTodoService) {}

  @Get('')
  @ApiOkResponse({
    type: TodoDto,
    isArray: true,
  })
  @ApiOperation({
    summary: 'Returns all to-do items',
    tags: ['todos'],
  })
  async getAll(): Promise<ITodo[]> {
    return this.serverFeatureTodoService.getAll();
  }

  @Get(':id')
  @ApiOkResponse({
    type: TodoDto,
  })
  @ApiOperation({
    summary: 'Returns a single to-do if it exists',
    tags: ['todos'],
  })
  async getOne(@Param('id') id: string): Promise<ITodo> {
    return this.serverFeatureTodoService.getOne(id);
  }

  @Post('')
  @ApiCreatedResponse({
    type: TodoDto,
  })
  @ApiOperation({
    summary: 'Creates a new to-do and returns the saved object',
    tags: ['todos'],
  })
  async create(@Body() data: CreateTodoDto): Promise<ITodo> {
    return this.serverFeatureTodoService.create(data);
  }

  @Put(':id')
  @ApiOkResponse({
    type: TodoDto,
  })
  @ApiCreatedResponse({
    type: TodoDto,
  })
  @ApiOperation({
    summary: 'Replaces all values for a single to-do',
    tags: ['todos'],
  })
  async upsertOne(@Body() data: UpsertTodoDto): Promise<ITodo> {
    return this.serverFeatureTodoService.upsert(data);
  }

  @Patch(':id')
  @ApiOkResponse({
    type: TodoDto,
  })
  @ApiOperation({
    summary: 'Partially updates a single to-do',
    tags: ['todos'],
  })
  async update(
    @Param('id') id: string,
    @Body() data: UpdateTodoDto
  ): Promise<ITodo> {
    return this.serverFeatureTodoService.update(id, data);
  }

  @Delete(':id')
  @ApiNoContentResponse({
    type: undefined,
  })
  @ApiOperation({
    summary: 'Deletes a specific to-do item',
    tags: ['todos'],
  })
  async delete(@Param('id') id: string): Promise<void> {
    return this.serverFeatureTodoService.delete(id);
  }
}
