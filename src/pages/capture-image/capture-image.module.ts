import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CaptureImagePage } from './capture-image';
import { ImageCropperModule } from 'ngx-img-cropper';

@NgModule({
  declarations: [
    CaptureImagePage,
  ],
  imports: [
    IonicPageModule.forChild(CaptureImagePage),
    ImageCropperModule
  ],
})
export class CaptureImagePageModule {}
