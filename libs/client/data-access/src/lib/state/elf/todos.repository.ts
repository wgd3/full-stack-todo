import { Injectable } from '@angular/core';
import { ITodo } from '@fst/shared/domain';
import { createStore } from '@ngneat/elf';
import {
  addEntities,
  deleteEntities,
  selectAllEntities,
  updateEntities,
  withEntities,
} from '@ngneat/elf-entities';
import { joinRequestResult, withRequestsStatus } from '@ngneat/elf-requests';

const store = createStore(
  { name: 'todos' },
  withEntities<ITodo>(),
  withRequestsStatus()
);

@Injectable({ providedIn: 'root' })
export class TodosRepository {
  todos$ = store.pipe(selectAllEntities(), joinRequestResult(['todos']));

  addTodo(data: ITodo) {
    store.update(addEntities(data));
  }

  loadTodos(todos: ITodo[]) {
    store.update(addEntities(todos));
  }

  updateTodo(todo: ITodo) {
    store.update(updateEntities(todo.id, { ...todo }));
  }

  deleteTodo(todoId: string) {
    store.update(deleteEntities(todoId));
  }
}
