import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmsConfigComponent } from './sms-config.component';

describe('SmsConfigComponent', () => {
  let component: SmsConfigComponent;
  let fixture: ComponentFixture<SmsConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SmsConfigComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SmsConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
