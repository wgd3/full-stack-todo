import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { AuthService } from '@fst/client/data-access';

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

  user$ = this.authService.userData$;

  logout() {
    this.authService.logoutUser();
    this.router.navigate([`/login`]);
  }
}
