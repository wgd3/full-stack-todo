import { HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, catchError, EMPTY } from 'rxjs';
import { handleApiError } from './handle-api-error-response';

describe(handleApiError.name, () => {
  let httpError: HttpErrorResponse;

  beforeEach(() => {
    httpError = new HttpErrorResponse({
      error: {
        message: 'foo',
        error: 'nar',
      },
    });
  });

  it('should intercept a thrown error', (done) => {
    const source = new BehaviorSubject<unknown>(null);
    source
      .asObservable()
      .pipe(
        handleApiError,
        catchError((err) => {
          expect(err.message).toBe('foo');
          done();
          return EMPTY;
        })
      )
      .subscribe();
    source.error(httpError);
  });

  it('should handle non-IApiErrorResponse objects', (done) => {
    const source = new BehaviorSubject<unknown>(null);
    const nonApiError = new HttpErrorResponse({
      error: {
        foo: 'bar',
      },
    });
    source
      .asObservable()
      .pipe(
        handleApiError,
        catchError((err) => {
          expect(err.foo).toBe('bar');
          done();
          return EMPTY;
        })
      )
      .subscribe();
    source.error(nonApiError);
  });

  it('should handle an array of error messages', (done) => {
    const messages = ['foo', 'bar'];
    httpError = new HttpErrorResponse({
      error: {
        message: messages,
        error: null,
      },
    });
    const source = new BehaviorSubject<unknown>(null);
    source
      .asObservable()
      .pipe(
        handleApiError,
        catchError((err) => {
          expect(err.message).toBe(messages.join(' '));
          done();
          return EMPTY;
        })
      )
      .subscribe();
    source.error(httpError);
  });

  it('should handle unknown errors', (done) => {
    const source = new BehaviorSubject<unknown>(null);
    const nonApiError = new Error('foo');
    source
      .asObservable()
      .pipe(
        handleApiError,
        catchError((err) => {
          expect(err.message).toBe('foo');
          done();
          return EMPTY;
        })
      )
      .subscribe();
    source.error(nonApiError);
  });
});
