import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BrandComponent } from './view/brand.component';
import { ViewBrandComponent } from './view/view-brand/view-brand.component';
import { SaveBrandComponent } from './view/save-brand/save-brand.component';


const routes: Routes = [
  {
    path: '',
    component : BrandComponent,
    children: [
      {
        path: '',
        component : ViewBrandComponent,
      },
      {
        path: 'save-brand',
        component : SaveBrandComponent,
      },
      {
        path: 'save-brand/:data',
        component : SaveBrandComponent,
      }
    ]
  }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BrandRoutingModule { }
