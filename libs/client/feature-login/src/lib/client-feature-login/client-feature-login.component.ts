import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TodoService } from '@fst/client/data-access';

type LoginFormType = {
  email: FormControl<string>;
  password: FormControl<string>;
};
@Component({
  selector: 'full-stack-todo-client-feature-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './client-feature-login.component.html',
  styleUrls: ['./client-feature-login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientFeatureLoginComponent {
  loginForm = new FormGroup<LoginFormType>({
    email: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    password: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  private readonly apiService = inject(TodoService);

  submitForm() {
    if (this.loginForm.valid && this.loginForm.dirty) {
      // use service to login, redirect on success
    }
  }
}
