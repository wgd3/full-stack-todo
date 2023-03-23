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
  constructor(
    @InjectRepository(ToDoEntitySchema)
    private todoRepository: Repository<ITodo>
  ) {}

  async getAll(userId: string): Promise<ITodo[]> {
    console.log(`todoService#getAll - userId: ${userId}`);
    return await this.todoRepository.find({
      where: {
        user: {
          id: userId,
        },
      },
    });
  }

  async getOne(userId: string, id: string): Promise<ITodo> {
    const todo = await this.todoRepository.findOneBy({ id, user_id: userId });
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
    if (existing) {
      throw new BadRequestException(
        `To-do with title '${todo.title}' already exists!`
      );
    }
    const newTodo = await this.todoRepository.save({
      ...todo,
      user: {
        id: userId,
      },
    });
    const saved = await this.todoRepository.findOneByOrFail({ id: newTodo.id });
    return saved;
  }

  async update(
    userId: string,
    id: string,
    data: Partial<Omit<ITodo, 'id'>>
  ): Promise<ITodo> {
    Logger.debug(
      `Updating todo ${id} with data:\n${JSON.stringify(data, null, 2)}`
    );
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

  async upsert(userId: string, data: ITodo): Promise<ITodo> {
    await this.todoRepository.save({
      ...data,
      user_id: userId,
    });

    // re-query the database so that the updated record is returned
    const updated = await this.todoRepository.findOneOrFail({
      where: { id: data.id, user_id: userId },
    });
    return updated;
  }

  async delete(userId: string, id: string): Promise<void> {
    const todo = await this.todoRepository.findOneBy({ id, user_id: userId });
    if (!todo) {
      throw new NotFoundException(`To-do could not be found!`);
    }
    await this.todoRepository.remove(todo);
    return;
  }
}
