import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Tab1Page } from './tab1';
import { PipesModule } from '../../pipes/pipes.module';


@NgModule({
  declarations: [
    Tab1Page
    
  ],
  imports: [
    IonicPageModule.forChild(Tab1Page),
    PipesModule,
  ],

})
export class Tab1PageModule {}
