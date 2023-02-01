import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSmsConfigComponent } from './view-sms-config.component';

describe('ViewSmsConfigComponent', () => {
  let component: ViewSmsConfigComponent;
  let fixture: ComponentFixture<ViewSmsConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewSmsConfigComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewSmsConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
