import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ScrollPage } from './scroll';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    ScrollPage,
  ],
  imports: [
    IonicPageModule.forChild(ScrollPage),
    PipesModule
  ],
  
})
export class ScrollPageModule {}
