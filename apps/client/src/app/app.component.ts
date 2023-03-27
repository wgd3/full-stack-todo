import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '@fst/client/data-access';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule],
  selector: 'fse-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  readonly authService = inject(AuthService);
  readonly router = inject(Router);

  user$ = this.authService.userData$;

  logout() {
    this.authService.logoutUser();
    this.router.navigate([`/login`]);
  }
}
