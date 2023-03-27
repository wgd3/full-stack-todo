import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ICreateUser, IPublicUserData, IUpdateUser } from '@fst/shared/domain';
import { environment } from '@fst/shared/util-env';
import { Observable } from 'rxjs';
import { handleApiError } from './handle-api-error-response';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/users`;

  getUser(id: string): Observable<IPublicUserData> {
    return this.http
      .get<IPublicUserData>(`${this.baseUrl}/${id}`)
      .pipe(handleApiError);
  }

  updateUser(id: string, data: IUpdateUser): Observable<IPublicUserData> {
    return this.http
      .patch<IPublicUserData>(`${this.baseUrl}/${id}`, data)
      .pipe(handleApiError);
  }

  createUser(data: ICreateUser): Observable<IPublicUserData> {
    return this.http
      .post<IPublicUserData>(this.baseUrl, data)
      .pipe(handleApiError);
  }
}
