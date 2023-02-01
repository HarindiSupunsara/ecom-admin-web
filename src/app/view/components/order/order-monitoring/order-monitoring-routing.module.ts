import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { OrderMonitoringComponent } from './view/order-monitoring.component';
import { ViewOrdersComponent } from './view/view-orders/view-orders.component';
import { TrackOrdersComponent } from './view/track-orders/track-orders.component';



const routes: Routes = [
  {
    path: '',
    component : OrderMonitoringComponent,
    children: [
      {
        path: '',
        component : ViewOrdersComponent,
      },
      {
        path: 'track-order',
        component : TrackOrdersComponent,
      },
      {
        path: 'track-order/:id',
        component : TrackOrdersComponent,
      }
    ]
  }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderMonitoringRoutingModule { }
