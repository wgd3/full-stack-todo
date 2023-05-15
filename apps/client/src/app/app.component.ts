import { SocialAuthService } from '@abacritt/angularx-social-login';
import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '@fst/client/data-access';

// eslint-disable-next-line @nx/enforce-module-boundaries
import { HeaderComponent } from '@fst/client/ui-components/header';
import { filter, switchMap } from 'rxjs';
@Component({
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent],
  selector: 'fse-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  private socialAuthService = inject(SocialAuthService);
  private authService = inject(AuthService);
  private router = inject(Router);

  ngOnInit(): void {
    this.socialAuthService.authState
      .pipe(
        filter((user) => !!user),
        switchMap(({ idToken }) => this.authService.loginGoogleUser(idToken))
      )
      .subscribe(({ access_token }) => {
        // console.log(`[AppComponent] Got JWT for Google user`, access_token);
        // console.log(`[AppComponent] Got google access token`, token);
        this.router.navigate(['/']);
      });
  }
}
