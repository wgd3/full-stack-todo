import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService, TodoService } from '@fst/client/data-access';
import { BehaviorSubject } from 'rxjs';

type LoginFormType = {
  email: FormControl<string>;
  password: FormControl<string>;
};
@Component({
  selector: 'full-stack-todo-client-feature-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './client-feature-login.component.html',
  styleUrls: ['./client-feature-login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientFeatureLoginComponent {
  private readonly authService = inject(AuthService);
  private router = inject(Router);

  loginForm = new FormGroup<LoginFormType>({
    email: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  errorMessage$ = new BehaviorSubject<string | null>(null);

  private readonly apiService = inject(TodoService);

  get emailInvalidAndTouched(): boolean {
    return (
      this.loginForm.controls.email.invalid &&
      this.loginForm.controls.email.touched
    );
  }

  get fEmail(): FormControl {
    return this.loginForm.controls.email as FormControl;
  }

  get fPassword(): FormControl {
    return this.loginForm.controls.password as FormControl;
  }

  submitForm() {
    if (this.loginForm.valid && this.loginForm.dirty) {
      this.errorMessage$.next(null);
      const { email, password } = this.loginForm.getRawValue();
      this.authService
        .loginUser({ email, password })
        .pipe
        // take(1)
        ()
        .subscribe({
          next: () => {
            console.log(`User authenticated, redirecting to dashboard...`);
            this.router.navigate(['/']);
          },
          error: (err) => {
            if (err instanceof HttpErrorResponse) {
              this.errorMessage$.next(err.error.message);
            } else {
              this.errorMessage$.next(
                `Unknown error occurred while logging in!`
              );
            }
            console.error(err);
          },
        });
    }
  }
}
