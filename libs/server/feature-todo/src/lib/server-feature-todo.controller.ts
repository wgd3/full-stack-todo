import {
  CreateTodoDto,
  ErrorResponseDto,
  TodoDto,
  UpdateTodoDto,
  UpsertTodoDto,
} from '@fst/server/data-access';
import { ReqUserId } from '@fst/server/util';
import { ITodo } from '@fst/shared/domain';
import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ServerFeatureTodoService } from './server-feature-todo.service';

@Controller({ path: 'todos', version: '1' })
@ApiTags('To-Do')
@ApiBearerAuth()
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
  async getAll(@ReqUserId() userId: string): Promise<ITodo[]> {
    console.log(`todoController#getAll`);
    return this.serverFeatureTodoService.getAll(userId);
  }

  @Get(':id')
  @ApiOkResponse({
    type: TodoDto,
  })
  @ApiOperation({
    summary: 'Returns a single to-do if it exists',
    tags: ['todos'],
  })
  async getOne(
    @ReqUserId() userId: string,
    @Param('id') id: string
  ): Promise<ITodo> {
    return this.serverFeatureTodoService.getOne(userId, id);
  }

  @Post('')
  @ApiCreatedResponse({
    type: TodoDto,
  })
  @ApiBadRequestResponse({
    type: ErrorResponseDto,
  })
  @ApiOperation({
    summary: 'Creates a new to-do and returns the saved object',
    tags: ['todos'],
  })
  async create(
    @ReqUserId() userId: string,
    @Body() data: CreateTodoDto
  ): Promise<ITodo> {
    return this.serverFeatureTodoService.create(userId, data);
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
  async upsertOne(
    @ReqUserId() userId: string,
    @Body() data: UpsertTodoDto
  ): Promise<ITodo> {
    return this.serverFeatureTodoService.upsert(userId, data);
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
    @ReqUserId() userId: string,
    @Param('id') id: string,
    @Body() data: UpdateTodoDto
  ): Promise<ITodo> {
    Logger.debug(`Updated todo ${id}`);
    return this.serverFeatureTodoService.update(userId, id, data);
  }

  @Delete(':id')
  @ApiNoContentResponse({
    type: undefined,
  })
  @ApiOperation({
    summary: 'Deletes a specific to-do item',
    tags: ['todos'],
  })
  async delete(
    @ReqUserId() userId: string,
    @Param('id') id: string
  ): Promise<void> {
    return this.serverFeatureTodoService.delete(userId, id);
  }
}
