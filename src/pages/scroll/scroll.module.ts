import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ScrollPage } from './scroll';

@NgModule({
  declarations: [
    ScrollPage,
  ],
  imports: [
    IonicPageModule.forChild(ScrollPage),
  ],
})
export class ScrollPageModule {}
