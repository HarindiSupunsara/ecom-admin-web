import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangePasswordAlertComponent } from './change-password-alert.component';

describe('ChangePasswordAlertComponent', () => {
  let component: ChangePasswordAlertComponent;
  let fixture: ComponentFixture<ChangePasswordAlertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangePasswordAlertComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangePasswordAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
