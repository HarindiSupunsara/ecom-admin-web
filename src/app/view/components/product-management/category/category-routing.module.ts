import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoryComponent } from './view/category.component';
import { SaveCategoryComponent } from './view/save-category/save-category.component';
import { ViewCategoryComponent } from './view/view-category/view-category.component';



const routes: Routes = [
  {
    path: '',
    component : CategoryComponent,
    children: [
      {
        path: '',
        component : ViewCategoryComponent,
      },
      {
        path: 'save-category',
        component : SaveCategoryComponent,
      },
      {
        path: 'save-category/:data',
        component : SaveCategoryComponent,
      }
    ]
  }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoryRoutingModule { }
