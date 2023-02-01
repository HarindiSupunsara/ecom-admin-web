import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ProductComponent } from './view/product.component';
import { ViewProductComponent } from './view/view-product/view-product.component';
import { SaveProductComponent } from './view/save-product/save-product.component';



const routes: Routes = [
  {
    path: '',
    component : ProductComponent,
    children: [
      {
        path: '',
        component : ViewProductComponent,
      },
      {
        path: 'save-product',
        component : SaveProductComponent,
      },
      {
        path: 'save-product/:data',
        component : SaveProductComponent,
      }
    ]
  }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductRoutingModule { }
