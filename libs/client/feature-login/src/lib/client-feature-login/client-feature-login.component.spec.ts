import {
  GoogleSigninButtonModule,
  SocialAuthService,
} from '@abacritt/angularx-social-login';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthService } from '@fst/client/data-access';
import { EMPTY } from 'rxjs';
import { ClientFeatureLoginComponent } from './client-feature-login.component';

describe('ClientFeatureLoginComponent', () => {
  let component: ClientFeatureLoginComponent;
  let fixture: ComponentFixture<ClientFeatureLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ClientFeatureLoginComponent,
        HttpClientTestingModule,
        GoogleSigninButtonModule,
      ],
      providers: [
        {
          provide: AuthService,
          useValue: {},
        },
        {
          provide: SocialAuthService,
          useValue: {
            // needed by the GoogleSignInButtonDirective
            initState: EMPTY,
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ClientFeatureLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
