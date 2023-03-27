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
import { handleApiError } from './handle-api-error-response';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  getAllToDoItems(): Observable<ITodo[]> {
    return this.http.get<ITodo[]>(`${this.baseUrl}/todos`).pipe(handleApiError);
  }

  getToDoById(todoId: string): Observable<ITodo> {
    return this.http
      .get<ITodo>(`${this.baseUrl}/todos/${todoId}`)
      .pipe(handleApiError);
  }

  createToDo(todoData: ICreateTodo): Observable<ITodo> {
    return this.http
      .post<ITodo>(`${this.baseUrl}/todos`, todoData)
      .pipe(handleApiError);
  }

  updateToDo(todoId: string, todoData: IUpdateTodo): Observable<ITodo> {
    return this.http
      .patch<ITodo>(`${this.baseUrl}/todos/${todoId}`, todoData)
      .pipe(handleApiError);
  }

  createOrUpdateToDo(todoId: string, todoData: IUpsertTodo): Observable<ITodo> {
    return this.http
      .put<ITodo>(`${this.baseUrl}/todos/${todoId}`, todoData)
      .pipe(handleApiError);
  }

  deleteToDo(todoId: string): Observable<null> {
    return this.http
      .delete<null>(`${this.baseUrl}/todos/${todoId}`)
      .pipe(handleApiError);
  }
}
