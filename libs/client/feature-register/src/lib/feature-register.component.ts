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
import {
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  PASSWORD_MIN_NUMBER,
  PASSWORD_MIN_SYMBOL,
  PASSWORD_MIN_UPPERCASE,
  SocialProviderEnum,
} from '@fst/shared/domain';
import { BehaviorSubject, take } from 'rxjs';
import {
  MATCHING_ERROR_KEY,
  MatchingPasswords,
} from './matching-passwords.validator';

type RegisterFormType = {
  email: FormControl<string>;
  password: FormControl<string>;
  confirmedPassword: FormControl<string>;
};

const passwordRegexp = new RegExp(
  `(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{${PASSWORD_MIN_LENGTH},${PASSWORD_MAX_LENGTH}})`
);

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
  readonly passwordReqs = {
    PASSWORD_MIN_LENGTH,
    PASSWORD_MAX_LENGTH,
    PASSWORD_MIN_NUMBER,
    PASSWORD_MIN_UPPERCASE,
    PASSWORD_MIN_SYMBOL,
  };
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
        validators: [
          Validators.required,
          Validators.minLength(PASSWORD_MIN_LENGTH),
          Validators.maxLength(PASSWORD_MAX_LENGTH),
          Validators.pattern(passwordRegexp),
        ],
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
        .createUser({
          email,
          password,
          familyName: null,
          givenName: null,
          profilePicture: null,
          socialProvider: SocialProviderEnum.email,
          socialId: null,
        })
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
