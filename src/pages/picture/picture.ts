import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, DateTime } from 'ionic-angular';
import { AngularFireStorage } from 'angularfire2/storage';
import { Observable } from 'rxjs/Observable';
import { finalize } from 'rxjs/operators';
import { GroundFirebaseStoreService } from '../../app/sources/services/ground-firebasestore.service';
import { AngularFireAuth } from 'angularfire2/auth';
import { GroundStorageService } from '../../app/sources/services/ground-storage.service';
import { UserDetails } from '../../app/sources/model/userdetails';
import * as firebase from 'firebase/app';
import { DatePipe } from '@angular/common';


@IonicPage()
@Component({
  selector: 'page-picture',
  templateUrl: 'picture.html',
})
export class PicturePage {

  uploadPercent: Observable<number>;
  downloadURL: Observable<string | null>;
  profileUrl: Observable<string | null>;
  meta: Observable<any>;
  user: Observable<firebase.User>;
  currentUserId: string;
  name: string; 
  structure: any = { lower: 33, upper: 60 };
  changeDate = '';

  @ViewChild('changeTime') changeDateTime: DateTime;

 
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public alertCtrl: AlertController,
    private _groundStorageService: GroundStorageService,
    private afAuth: AngularFireAuth,
    private _groundFirebaseStoreService: GroundFirebaseStoreService,
    private storage: AngularFireStorage) {
    this.user = this.afAuth.authState;
    this.afAuth.authState.subscribe(res => {
      if (res && res.uid) {
        this.currentUserId = res.uid;
      }
    });

    let datePipe = new DatePipe('en-US');
    this.changeDate = datePipe.transform(new Date(), 'yyyy-MM-dd');

  }

  handleChangeDate(changeDate: string) {
    this.changeDate = changeDate;
    this.changeDateTime._text = changeDate;
    this._groundFirebaseStoreService.setUserData(this.currentUserId, this.changeDateTime._text, 'dob')
  }

  setSettingAgeRange(){
    this._groundFirebaseStoreService.setSettingData(this.currentUserId, this.structure.lower, 'age_lower');
    this._groundFirebaseStoreService.setSettingData(this.currentUserId, this.structure.upper, 'age_upper');

  }

  setSettingData($event: any, param: string) {
    console.log('$event', $event);
    this._groundFirebaseStoreService.setSettingData(this.currentUserId, $event, param);
  }

 
  setUserDataName() {
  
    this._groundFirebaseStoreService.setUserData(this.currentUserId, this.name, 'name');
  }


  setUserData($event: any, param: string) {
    console.log('$event', $event);
    this._groundFirebaseStoreService.setUserData(this.currentUserId, $event, param);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PicturePage');
    this.changeDateTime.updateText = () => { };
  }

 
  uploadFile(event) {
  
      const file = event.target.files[0];
      const filePath = this.currentUserId;
      const ref = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, file);
      this.uploadPercent = task.percentageChanges();
      // get notified when the download URL is available
      task.snapshotChanges().pipe(finalize(() => {
        this.downloadURL = ref.getDownloadURL();
        this.downloadURL.subscribe((data) => {
          this._groundFirebaseStoreService.updatePhotoURL(this.currentUserId, data);
        });

      })).subscribe();
      this.meta = ref.getMetadata(); 
  }

}
