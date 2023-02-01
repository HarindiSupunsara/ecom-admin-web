import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MenuComponent } from './view/menu.component';
import { ViewMenuComponent } from './view/view-menu/view-menu.component';
import { SaveMenuComponent } from './view/save-menu/save-menu.component';



const routes: Routes = [
  {
    path: '',
    component : MenuComponent,
    children: [
      {
        path: '',
        component : ViewMenuComponent,
      },
      {
        path: 'save-menu',
        component : SaveMenuComponent,
      },
      {
        path: 'save-menu/:data',
        component : SaveMenuComponent,
      }
    ]
  }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MenuRoutingModule { }
