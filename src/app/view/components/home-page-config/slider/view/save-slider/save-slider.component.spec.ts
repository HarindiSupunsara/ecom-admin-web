import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveSliderComponent } from './save-slider.component';

describe('SaveSliderComponent', () => {
  let component: SaveSliderComponent;
  let fixture: ComponentFixture<SaveSliderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaveSliderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
