import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DisplayUserPage } from './display-user';

@NgModule({
  declarations: [
    DisplayUserPage,
  ],
  imports: [
    IonicPageModule.forChild(DisplayUserPage),
  ],
})
export class DisplayUserPageModule {}
