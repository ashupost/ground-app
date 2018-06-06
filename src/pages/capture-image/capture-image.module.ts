import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CaptureImagePage } from './capture-image';

@NgModule({
  declarations: [
    CaptureImagePage,
  ],
  imports: [
    IonicPageModule.forChild(CaptureImagePage),
  ],
})
export class CaptureImagePageModule {}
