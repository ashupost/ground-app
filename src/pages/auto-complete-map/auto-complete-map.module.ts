import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AutoCompleteMapPage } from './auto-complete-map';
import { AgmCoreModule } from '@agm/core';
import { AgmJsMarkerClustererModule } from '@agm/js-marker-clusterer';


@NgModule({
  declarations: [
    AutoCompleteMapPage,
  ],
  imports: [
    IonicPageModule.forChild(AutoCompleteMapPage),
    AgmCoreModule.forRoot({ apiKey: 'AIzaSyCxjWoBYpJNCtd1wGvNk3n8nEgR4ryvqA8' , libraries: ["places"]}),
    AgmJsMarkerClustererModule
 
  ],
})
export class AutoCompleteMapPageModule {}
