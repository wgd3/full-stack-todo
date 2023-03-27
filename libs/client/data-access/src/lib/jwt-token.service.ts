import { Injectable } from '@angular/core';
import { TOKEN_STORAGE_KEY } from '@fst/client/util';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class JwtTokenService {
  private accessToken$$ = new BehaviorSubject<string | null>(null);

  accessToken$ = this.accessToken$$.pipe();

  setToken(val: string) {
    this.accessToken$$.next(val);
    localStorage.setItem(TOKEN_STORAGE_KEY, val);
  }

  clearToken() {
    this.accessToken$$.next(null);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  }
}
