import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ScrollPage } from './scroll';
import {InfiniteScrollModule} from 'ngx-infinite-scroll';

@NgModule({
  declarations: [
    ScrollPage,
  ],
  imports: [
    IonicPageModule.forChild(ScrollPage),
    InfiniteScrollModule
  ],
  exports: [InfiniteScrollModule]
  
})
export class ScrollPageModule {}
