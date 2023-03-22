import { ToDoEntitySchema } from '@fst/server/data-access';
import { ITodo } from '@fst/shared/domain';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ServerFeatureTodoService {
  constructor(
    @InjectRepository(ToDoEntitySchema)
    private todoRepository: Repository<ITodo>
  ) {}

  async getAll(userId: string): Promise<ITodo[]> {
    return await this.todoRepository.find({ where: { user_id: userId } });
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
    const newTodo = await this.todoRepository.save({
      ...todo,
      user_id: userId,
    });
    return newTodo;
  }

  async update(
    userId: string,
    id: string,
    data: Partial<Omit<ITodo, 'id'>>
  ): Promise<ITodo> {
    const todo = await this.todoRepository.findOneBy({ id, user_id: userId });
    if (!todo) {
      throw new NotFoundException(`To-do could not be found!`);
    }

    await this.todoRepository.save({
      id,
      ...data,
      user_id: userId,
    });

    // re-query the database so that the updated record is returned
    const updated = await this.todoRepository.findOneOrFail({
      where: { id, user_id: userId },
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
