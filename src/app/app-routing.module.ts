import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from './service/auth/auth-guard.service';

const routes: Routes = [
  {
    path: '',
    loadChildren : () => import('./view/core/home/home.module').then(m => m.HomeModule),
    canActivate : [AuthGuardService]
  },
  {
    path: 'home',
    loadChildren : () => import('./view/core/home/home.module').then(m => m.HomeModule),
    canActivate : [AuthGuardService]
  },
  {
    path: '',
    loadChildren : () => import('./view/core/login/login.module').then(m => m.LoginModule),
  },
  {
    path: 'login',
    loadChildren : () => import('./view/core/login/login.module').then(m => m.LoginModule),
  },
  {
    path: '**', redirectTo: '' 
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash : true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
