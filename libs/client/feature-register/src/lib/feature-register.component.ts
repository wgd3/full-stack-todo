import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '@fst/client/data-access';
import { BehaviorSubject, take } from 'rxjs';
import {
  MatchingPasswords,
  MATCHING_ERROR_KEY,
} from './matching-passwords.validator';

type RegisterFormType = {
  email: FormControl<string>;
  password: FormControl<string>;
  confirmedPassword: FormControl<string>;
};

@Component({
  selector: 'full-stack-todo-feature-register',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './feature-register.component.html',
  styleUrls: ['./feature-register.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatureRegisterComponent {
  readonly matchingErrorKey = MATCHING_ERROR_KEY;
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);

  registerForm = new FormGroup<RegisterFormType>(
    {
      email: new FormControl<string>('', {
        nonNullable: true,
        validators: [Validators.required, Validators.email],
      }),
      password: new FormControl<string>('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      confirmedPassword: new FormControl<string>('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
    },
    {
      validators: MatchingPasswords('password', 'confirmedPassword'),
      updateOn: 'blur',
    }
  );

  errorMessage$ = new BehaviorSubject<string | null>(null);

  get fEmail(): FormControl {
    return this.registerForm.controls.email as FormControl;
  }

  get fPassword(): FormControl {
    return this.registerForm.controls.password as FormControl;
  }

  get fConfirmedPassword(): FormControl {
    return this.registerForm.controls.confirmedPassword as FormControl;
  }

  register() {
    if (this.registerForm.valid && this.registerForm.dirty) {
      const { email, password } = this.registerForm.getRawValue();
      this.userService
        .createUser({ email, password })
        .pipe(take(1))
        .subscribe({
          next: (user) => {
            this.router.navigate(['/']);
          },
          error: (err: Error) => {
            this.errorMessage$.next(err.message);
          },
        });
    }
  }
}
