import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Tab3Page } from './tab3';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    Tab3Page,
  ],
  imports: [
    IonicPageModule.forChild(Tab3Page),
    PipesModule
  ],
})
export class Tab3PageModule {}
