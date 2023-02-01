import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewFilterComponent } from './view-filter.component';

describe('ViewFilterComponent', () => {
  let component: ViewFilterComponent;
  let fixture: ComponentFixture<ViewFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
