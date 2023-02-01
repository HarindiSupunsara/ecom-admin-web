import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveRoleComponent } from './save-role.component';

describe('SaveRoleComponent', () => {
  let component: SaveRoleComponent;
  let fixture: ComponentFixture<SaveRoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaveRoleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
