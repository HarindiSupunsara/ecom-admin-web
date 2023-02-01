import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrderDetailsComponent } from './view/order-details.component';
import { TrackOrdersComponent } from './view/track-orders/track-orders.component';
import { ViewOrdersComponent } from './view/view-orders/view-orders.component';



const routes: Routes = [
  {
    path: '',
    component : OrderDetailsComponent,
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
export class OrderDetailsRoutingModule { }
