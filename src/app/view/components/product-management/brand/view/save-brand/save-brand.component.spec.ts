import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveBrandComponent } from './save-brand.component';

describe('SaveBrandComponent', () => {
  let component: SaveBrandComponent;
  let fixture: ComponentFixture<SaveBrandComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaveBrandComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveBrandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
