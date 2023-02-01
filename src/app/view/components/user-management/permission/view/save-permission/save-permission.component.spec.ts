import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavePermissionComponent } from './save-permission.component';

describe('SavePermissionComponent', () => {
  let component: SavePermissionComponent;
  let fixture: ComponentFixture<SavePermissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SavePermissionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SavePermissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
