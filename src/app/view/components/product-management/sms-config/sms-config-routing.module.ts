import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SmsConfigComponent } from './view/sms-config.component';
import { ViewSmsConfigComponent } from './view/view-sms-config/view-sms-config.component';
import { SaveSmsConfigComponent } from './view/save-sms-config/save-sms-config.component';



const routes: Routes = [
  {
    path: '',
    component : SmsConfigComponent,
    children: [
      {
        path: '',
        component : ViewSmsConfigComponent,
      },
      {
        path: 'save-sms',
        component : SaveSmsConfigComponent,
      },
      {
        path: 'save-sms/:data',
        component : SaveSmsConfigComponent,
      }
    ]
  }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SmsConfigRoutingModule { }
