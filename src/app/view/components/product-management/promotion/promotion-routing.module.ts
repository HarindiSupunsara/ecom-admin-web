import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PromotionComponent } from './view/promotion.component';
import { SavePromotionComponent } from './view/save-promotion/save-promotion.component';
import { ViewPromotionComponent } from './view/view-promotion/view-promotion.component';



const routes: Routes = [
  {
    path: '',
    component : PromotionComponent,
    children: [
      {
        path: '',
        component : ViewPromotionComponent,
      },
      {
        path: 'save-promotion',
        component : SavePromotionComponent,
      },
      {
        path: 'save-promotion/:data',
        component : SavePromotionComponent,
      }
    ]
  }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PromotionRoutingModule { }
