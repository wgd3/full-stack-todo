import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  ICreateTodo,
  ITodo,
  IUpdateTodo,
  IUpsertTodo,
} from '@fst/shared/domain';
import { environment } from '@fst/shared/util-env';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  getAllToDoItems(): Observable<ITodo[]> {
    return this.http.get<ITodo[]>(`${this.baseUrl}/todos`);
  }

  getToDoById(todoId: string): Observable<ITodo> {
    return this.http.get<ITodo>(`${this.baseUrl}/todos/${todoId}`);
  }

  createToDo(todoData: ICreateTodo): Observable<ITodo> {
    return this.http.post<ITodo>(`${this.baseUrl}/todos`, todoData);
  }

  updateToDo(todoId: string, todoData: IUpdateTodo): Observable<ITodo> {
    return this.http.patch<ITodo>(`${this.baseUrl}/todos/${todoId}`, todoData);
  }

  createOrUpdateToDo(todoId: string, todoData: IUpsertTodo): Observable<ITodo> {
    return this.http.put<ITodo>(`${this.baseUrl}/todos/${todoId}`, todoData);
  }

  deleteToDo(todoId: string): Observable<null> {
    return this.http.delete<null>(`${this.baseUrl}/todos/${todoId}`);
  }
}
