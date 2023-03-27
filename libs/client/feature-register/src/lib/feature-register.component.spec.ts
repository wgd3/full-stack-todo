import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeatureRegisterComponent } from './feature-register.component';

describe('FeatureRegisterComponent', () => {
  let component: FeatureRegisterComponent;
  let fixture: ComponentFixture<FeatureRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeatureRegisterComponent, HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(FeatureRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
