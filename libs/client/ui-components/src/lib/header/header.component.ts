import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
// eslint-disable-next-line @nx/enforce-module-boundaries
import {
  AuthService,
  ITodoFacade,
  TODO_FACADE_PROVIDER,
} from '@fst/client/data-access';
import { map } from 'rxjs';

@Component({
  selector: 'fst-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  readonly router = inject(Router);
  readonly authService = inject(AuthService);
  readonly todoFacade: ITodoFacade = inject(TODO_FACADE_PROVIDER);

  user$ = this.authService.userData$;

  incompleteTodoCount$ = this.todoFacade.todos$.pipe(
    map((todos) => todos.filter((td) => td.completed === false).length)
  );

  logout() {
    this.authService.logoutUser();
    this.router.navigate([`/login`]);
  }
}
