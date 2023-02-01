import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavePromotionComponent } from './save-promotion.component';

describe('SavePromotionComponent', () => {
  let component: SavePromotionComponent;
  let fixture: ComponentFixture<SavePromotionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SavePromotionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SavePromotionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
