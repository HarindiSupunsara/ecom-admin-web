import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SliderComponent } from './view/slider.component';
import { ViewSliderComponent } from './view/view-slider/view-slider.component';
import { SaveSliderComponent } from './view/save-slider/save-slider.component';



const routes: Routes = [
  {
    path: '',
    component : SliderComponent,
    children: [
      {
        path: '',
        component : ViewSliderComponent,
      },
      {
        path: 'save-slider',
        component : SaveSliderComponent,
      },
      {
        path: 'save-slider/:data',
        component : SaveSliderComponent,
      }
    ]
  }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SliderRoutingModule { }
