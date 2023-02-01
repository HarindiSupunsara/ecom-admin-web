import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FilterComponent } from './view/filter.component';
import { ViewFilterComponent } from './view/view-filter/view-filter.component';
import { SaveFilterComponent } from './view/save-filter/save-filter.component';



const routes: Routes = [
  {
    path: '',
    component : FilterComponent,
    children: [
      {
        path: '',
        component : ViewFilterComponent,
      },
      {
        path: 'save-filter',
        component : SaveFilterComponent,
      },
      {
        path: 'save-filter/:data',
        component : SaveFilterComponent,
      }
    ]
  }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FilterRoutingModule { }
