import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveSmsConfigComponent } from './save-sms-config.component';

describe('SaveSmsConfigComponent', () => {
  let component: SaveSmsConfigComponent;
  let fixture: ComponentFixture<SaveSmsConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaveSmsConfigComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaveSmsConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
