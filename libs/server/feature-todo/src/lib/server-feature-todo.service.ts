import { ToDoEntitySchema } from '@fst/server/data-access';
import { ITodo } from '@fst/shared/domain';
import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ServerFeatureTodoService {
  private readonly logger = new Logger(ServerFeatureTodoService.name);
  constructor(
    @InjectRepository(ToDoEntitySchema)
    private todoRepository: Repository<ITodo>
  ) {}

  async getAll(userId: string): Promise<ITodo[]> {
    return await this.todoRepository.find({
      where: {
        user: {
          id: userId,
        },
      },
    });
  }

  async getOne(userId: string, id: string): Promise<ITodo> {
    const todo = await this.todoRepository.findOneBy({
      id,
      user: { id: userId },
    });
    if (!todo) {
      throw new NotFoundException(`To-do could not be found!`);
    }
    return todo;
  }

  async create(
    userId: string,
    todo: Pick<ITodo, 'title' | 'description'>
  ): Promise<ITodo> {
    const existing = await this.todoRepository.findOneBy({
      title: todo.title,
      user: { id: userId },
    });
    this.logger.debug(`Creating new todo, exists already: ${!!existing}`);
    if (existing) {
      throw new BadRequestException(
        `To-do with title '${todo.title}' already exists!`
      );
    }
    this.logger.debug(
      `Saving new todo\n${JSON.stringify(
        { ...todo, user_id: userId },
        null,
        2
      )}`
    );
    const newTodo = await this.todoRepository.save({
      ...todo,
      // user_id: userId,
      user: {
        id: userId,
      },
    });
    const saved = await this.todoRepository.findOneByOrFail({
      id: newTodo.id,
      user: {
        id: userId,
      },
    });
    return saved;
  }

  async update(
    userId: string,
    id: string,
    data: Partial<Omit<ITodo, 'id'>>
  ): Promise<ITodo> {
    const todo = await this.todoRepository.findOneBy({
      id,
      user: { id: userId },
    });
    if (!todo) {
      throw new NotFoundException(`To-do could not be found!`);
    }

    await this.todoRepository.save({
      id,
      ...data,
      user: {
        id: userId,
      },
    });

    // re-query the database so that the updated record is returned
    const updated = await this.todoRepository.findOneOrFail({
      where: { id, user: { id: userId } },
    });
    return updated;
  }

  /**
   * An upsert operation should take a complete object, and either update the properties
   * of an existing entity, or create an entity if one with the given ID does not exist.
   *
   * TypeORM's `save()` operation does this same thing. Additionally, the EntitySchema
   * for a Todo entity prevents changing it's UUID.
   *
   * @async
   * @param {string} userId
   * @param {string} todoId
   * @param {ITodo} data
   * @returns {Promise<ITodo>}
   */
  async upsert(userId: string, todoId: string, data: ITodo): Promise<ITodo> {
    // look for any todo with the given UUID
    const existingTodo = await this.todoRepository.findOne({
      where: { id: todoId },
      select: {
        user: {
          id: true,
        },
      },
      relations: ['user'],
    });

    // todo with requested UUID exists, but belongs to another user
    if (existingTodo && existingTodo.user?.id !== userId) {
      // 404 isn't the right exception, as by definition any UPSERT operation
      // should create an entity when it's missing
      throw new BadRequestException(`Invalid UUID`);
    }

    // this.logger.debug(`UPSERT found todo: ${JSON.stringify(existingTodo, null, 2)}`);

    // if (existingTodo && existingTodo.id !== data.id) {
    //   throw new BadRequestException(`ID can not be changed!`);
    // }
    this.logger.debug(
      `Upserting todo ${data.id.split('-')[0]} for user ${userId.split('-')[0]}`
    );

    await this.todoRepository.save({
      ...data,
      user: { id: userId },
    });

    // re-query the database so that the updated record is returned
    const updated = await this.todoRepository.findOneOrFail({
      where: { id: data.id, user: { id: userId } },
    });

    return updated;
  }

  async delete(userId: string, id: string): Promise<void> {
    const todo = await this.todoRepository.findOneBy({
      id,
      user: { id: userId },
    });
    if (!todo) {
      throw new NotFoundException(`To-do could not be found!`);
    }
    await this.todoRepository.remove(todo);
    return;
  }
}
