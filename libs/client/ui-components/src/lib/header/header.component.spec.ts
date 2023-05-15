/* eslint-disable @nx/enforce-module-boundaries */
import { SocialAuthService } from '@abacritt/angularx-social-login';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TODO_FACADE_PROVIDER } from '@fst/client/data-access';
import { fromTodos } from '@fst/client/state/ngrx';
import { TodoNgRxFacade } from '@fst/client/state/ngrx/todo.facade';
import { StoreModule } from '@ngrx/store';
import { HeaderComponent } from './header.component';
describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HeaderComponent,
        RouterTestingModule,
        HttpClientTestingModule,
        StoreModule.forRoot({
          [fromTodos.TODOS_FEATURE_KEY]: fromTodos.todosReducer,
        }),
      ],
      providers: [
        { provide: ActivatedRoute, useValue: {} },
        {
          provide: TODO_FACADE_PROVIDER,
          useClass: TodoNgRxFacade,
        },
        {
          provide: SocialAuthService,
          useValue: {},
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
