import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SaveUserComponent } from './view/save-user/save-user.component';
import { UserComponent } from './view/user.component';
import { ViewUserComponent } from './view/view-user/view-user.component';



const routes: Routes = [
  {
    path: '',
    component : UserComponent,
    children: [
      {
        path: '',
        component : ViewUserComponent,
      },
      {
        path: 'save-user',
        component : SaveUserComponent,
      },
      {
        path: 'save-user/:data',
        component : SaveUserComponent,
      }
    ]
  }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
