import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SectionComponent } from './view/section.component';
import { ViewSectionComponent } from './view/view-section/view-section.component';
import { SaveSectionComponent } from './view/save-section/save-section.component';



const routes: Routes = [
  {
    path: '',
    component : SectionComponent,
    children: [
      {
        path: '',
        component : ViewSectionComponent,
      },
      {
        path: 'save-section',
        component : SaveSectionComponent,
      },
      {
        path: 'save-section/:data',
        component : SaveSectionComponent,
      }
    ]
  }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SectionRoutingModule { }
