import { NgModule } from '@angular/core';
import { PermissionComponent } from './view/permission.component';
import { RouterModule, Routes } from '@angular/router';
import { ViewPermissionComponent } from './view/view-permission/view-permission.component';
import { SavePermissionComponent } from './view/save-permission/save-permission.component';


const routes: Routes = [
  {
    path: '',
    component : PermissionComponent,
    children: [
      {
        path: '',
        component : ViewPermissionComponent,
      },
      {
        path: 'save-permission',
        component : SavePermissionComponent,
      },
      {
        path: 'save-permission/:data',
        component : SavePermissionComponent,
      }
    ]
  }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PermissionRoutingModule { }
