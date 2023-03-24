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
  HttpCode,
  Logger,
  Param,
  ParseUUIDPipe,
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
  private readonly logger = new Logger(ServerFeatureTodoController.name);
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
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: UpsertTodoDto
  ): Promise<ITodo> {
    this.logger.debug(
      `User ${userId.split('-')[0]} attempting to update todo ${
        id.split('-')[0]
      }`
    );
    // this.logger.debug(`Incoming payload:\n${JSON.stringify(data, null, 2)}`);
    return this.serverFeatureTodoService.upsert(userId, id, data);
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
  @HttpCode(204)
  async delete(
    @ReqUserId() userId: string,
    @Param('id') id: string
  ): Promise<void> {
    return this.serverFeatureTodoService.delete(userId, id);
  }
}
