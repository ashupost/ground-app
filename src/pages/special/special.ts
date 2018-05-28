import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { GroundFirebaseDatabaseService } from '../../app/sources/services/ground-firebase-database.service';
import { BackgroundGeolocation, BackgroundGeolocationConfig, BackgroundGeolocationResponse } from '@ionic-native/background-geolocation';
import { AngularFireStorage, AngularFireStorageReference } from 'angularfire2/storage';
import { Observable } from 'rxjs/Observable';
import { LocationTrackerService } from '../../app/sources/services/location-tracker.service';



@IonicPage()
@Component({
  selector: 'page-special',
  templateUrl: 'special.html',
  providers: [GroundFirebaseDatabaseService, LocationTrackerService]
})
export class SpecialPage {

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private _angularFireStorage: AngularFireStorage,
    private _storage: Storage,
    public _locationTrackerService: LocationTrackerService,
    private _groundFirebaseDatabaseService: GroundFirebaseDatabaseService) {
  }
  profileUrl: Observable<string | null>;

  uploadFile(event) {
    const file = event.target.files[0];
    // console.log('file',file);
    const filePath = 'name-your-file-path-here';
    const ref = this._angularFireStorage.ref(filePath);
    //console.log('ref',file);

    const task = ref.put(file, { customMetadata: { blah: 'blah' } });
    this.profileUrl = ref.getDownloadURL();
   console.log(this.profileUrl);
  
  }
  startTrack(){
    this._locationTrackerService.startTracking('MK');
   
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SpecialPage');
  }

}
