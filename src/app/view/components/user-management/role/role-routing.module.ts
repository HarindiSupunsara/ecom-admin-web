import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleComponent } from './view/role.component';
import { SaveRoleComponent } from './view/save-role/save-role.component';
import { ViewRoleComponent } from './view/view-role/view-role.component';


const routes: Routes = [
  {
    path: '',
    component : RoleComponent,
    children: [
      {
        path: '',
        component : ViewRoleComponent,
      },
      {
        path: 'save-role',
        component : SaveRoleComponent,
      },
      {
        path: 'save-role/:data',
        component : SaveRoleComponent,
      }
    ]
  }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoleRoutingModule { }
