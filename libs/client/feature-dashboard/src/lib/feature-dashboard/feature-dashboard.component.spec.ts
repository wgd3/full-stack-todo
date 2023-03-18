import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ApiService } from '@fst/client/data-access';

import { FeatureDashboardComponent } from './feature-dashboard.component';

describe('FeatureDashboardComponent', () => {
  let component: FeatureDashboardComponent;
  let fixture: ComponentFixture<FeatureDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeatureDashboardComponent, HttpClientTestingModule],
      providers: [ApiService],
    }).compileComponents();

    fixture = TestBed.createComponent(FeatureDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
