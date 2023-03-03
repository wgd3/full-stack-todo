import { Injectable, NotFoundException } from '@nestjs/common';
import { ITodo } from '@fst/shared/domain';
import { BehaviorSubject } from 'rxjs';
import { DataSource, Repository } from 'typeorm';
import { ToDoEntitySchema } from '@fst/server/data-access-todo';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ServerFeatureTodoService {
  // private todos$$ = new BehaviorSubject<ITodo[]>([
  //   {
  //     id: 'something-something-dark-side',
  //     title: 'Add a route to create todo items!',
  //     description: 'Yes, this is foreshadowing a POST route introduction',
  //     completed: false,
  //   },
  //   {
  //     id: 'foo',
  //     title: 'Foo',
  //     description: 'Bar!',
  //     completed: true,
  //   },
  // ]);

  constructor(
    @InjectRepository(ToDoEntitySchema)
    private todoRepository: Repository<ITodo>
  ) {}

  async getAll(): Promise<ITodo[]> {
    return await this.todoRepository.find();
  }

  async getOne(id: string): Promise<ITodo> {
    // const todo = this.todos$$.value.find((td) => td.id === id);
    const todo = await this.todoRepository.findOneBy({ id });
    if (!todo) {
      throw new NotFoundException(`To-do could not be found!`);
    }
    return todo;
  }

  async create(todo: Pick<ITodo, 'title' | 'description'>): Promise<ITodo> {
    // const current = this.todos$$.value;
    // const newTodo: ITodo = {
    //   ...todo,
    // id: `todo-${Math.floor(Math.random() * 10000)}`,
    //   completed: false,
    // };
    // this.todos$$.next([...current, newTodo]);
    const newTodo = await this.todoRepository.save({ ...todo });
    return newTodo;
  }

  async update(id: string, data: Partial<Omit<ITodo, 'id'>>): Promise<ITodo> {
    // const todo = this.todos$$.value.find((td) => td.id === id);
    // if (!todo) {
    //   throw new NotFoundException(`To-do could not be found!`);
    // }
    // const updated = { ...todo, ...data };
    // this.todos$$.next([
    //   ...this.todos$$.value.map((td) => (td.id === id ? updated : td)),
    // ]);
    await this.todoRepository.save({
      id,
      ...data,
    });

    // re-query the database so that the updated record is returned
    const updated = await this.todoRepository.findOneOrFail({ where: { id } });
    return updated;
  }

  async upsert(data: ITodo): Promise<ITodo> {
    // const todo = this.todos$$.value.find((td) => td.id === data.id);
    // if (!todo) {
    //   this.todos$$.next([...this.todos$$.value, data]);
    //   return data;
    // }
    // const updated = { ...todo, ...data };
    // this.todos$$.next([
    //   ...this.todos$$.value.map((td) => (td.id === updated.id ? updated : td)),
    // ]);
    await this.todoRepository.save({
      ...data,
    });

    // re-query the database so that the updated record is returned
    const updated = await this.todoRepository.findOneOrFail({
      where: { id: data.id },
    });
    return updated;
  }

  async delete(id: string): Promise<void> {
    // const todo = this.todos$$.value.find((td) => td.id === id);
    // if (!todo) {
    //   throw new NotFoundException(`To-do could not be found!`);
    // }
    // this.todos$$.next([...this.todos$$.value.filter((td) => td.id !== id)]);
    await this.todoRepository.delete({ id });
    return;
  }
}
