import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderMonitoringComponent } from './order-monitoring.component';

describe('OrderMonitoringComponent', () => {
  let component: OrderMonitoringComponent;
  let fixture: ComponentFixture<OrderMonitoringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderMonitoringComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderMonitoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
