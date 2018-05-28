import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PersonalPage } from './personal';
import { AgmCoreModule } from '@agm/core';

@NgModule({
  declarations: [
    PersonalPage,
  ],
  imports: [
    IonicPageModule.forChild(PersonalPage),
    AgmCoreModule.forRoot({ apiKey: 'AIzaSyCxjWoBYpJNCtd1wGvNk3n8nEgR4ryvqA8' })
  ],
})
export class PersonalPageModule {}
