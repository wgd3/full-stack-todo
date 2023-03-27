import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ICreateUser, IPublicUserData, IUpdateUser } from '@fst/shared/domain';
import { environment } from '@fst/shared/util-env';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/users`;

  getUser(id: string): Observable<IPublicUserData> {
    return this.http.get<IPublicUserData>(`${this.baseUrl}/${id}`);
  }

  updateUser(id: string, data: IUpdateUser): Observable<IPublicUserData> {
    return this.http.patch<IPublicUserData>(`${this.baseUrl}/${id}`, data);
  }

  createUser(data: ICreateUser): Observable<IPublicUserData> {
    return this.http.post<IPublicUserData>(this.baseUrl, data);
  }
}
