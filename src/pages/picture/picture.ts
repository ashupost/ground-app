import { Component, ViewChild, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, DateTime, App, Platform } from 'ionic-angular';
import { AngularFireStorage } from 'angularfire2/storage';
import { Observable } from 'rxjs/Observable';
import { finalize } from 'rxjs/operators';
import { GroundFirebaseStoreService } from '../../app/sources/services/ground-firebasestore.service';
import { AngularFireAuth } from 'angularfire2/auth';
import { PictureDetail, PhotoStatus } from '../../app/sources/model/userdetails';
import * as firebase from 'firebase';
import { DatePipe } from '@angular/common';
import { CameraService } from '../../app/sources/camera/camera.service';
import { UtilService } from '../../app/sources/services/util.service';
import { CaptureImagePage } from '../capture-image/capture-image';
import {  Subscription } from 'rxjs';

@IonicPage()
@Component({
  selector: 'page-picture',
  templateUrl: 'picture.html'
})
export class PicturePage {

  uploadPercent: Observable<number>;
  downloadURL: Observable<string | null>;
  profileUrl: Observable<string | null>;
  meta: Observable<any>;
  user: Observable<firebase.User>;
  currentUserId: string;
  name: string;
  gender: string;
  structure: any = { lower: 33, upper: 60 };
  changeDate = '';
  isCordova: boolean;
  // photos: Observable<any[]>;
  photos: any = [];


  @ViewChild('changeTime') changeDateTime: DateTime;
  //currentUserPhotoURL: Observable<string | null>;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private __app: App,
    private __zone: NgZone,
    public alertCtrl: AlertController,
    private __utilService: UtilService,
    private afAuth: AngularFireAuth,
    private __platform: Platform,
    private _groundFirebaseStoreService: GroundFirebaseStoreService,
    private storage: AngularFireStorage) {
   // this.isCordova = this.__utilService.isCordova;

    this.__platform.ready().then(() => {
    if (this.__platform.is('cordova')) this.isCordova= true;
  else this.isCordova= false;
  });


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

  setSettingAgeRange() {
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

  private messagesLoader1: Subscription;
  private messagesLoader2: Subscription;
 
  ionViewDidLoad() {
    console.log('ionViewDidLoad PicturePage');
    this.changeDateTime.updateText = () => { };
    this.afAuth.authState.subscribe(res => {
      if (res && res.uid) {
      this.messagesLoader1= this._groundFirebaseStoreService.getPhotoUserData(res.uid).subscribe(data => {
          this.photos = data;
        });

        this.messagesLoader2 = this._groundFirebaseStoreService.getUserByid(res.uid).subscribe(data => {
          this.name = data.name;
          this.gender = data.gender;
        });
      }
    });
  }
  ionViewDidLeave(){
    this.messagesLoader1.unsubscribe();
    this.messagesLoader2.unsubscribe();

  }

  takePhoto() {
      this.__app.getRootNav().push(CaptureImagePage);
   }

  removePhoto(uid: string) {
    const confirm = this.alertCtrl.create({
      title: 'Delete Selected Photo?',
      message: 'Do you agree to delete seleted photo?',
      buttons: [{ text: 'NO', handler: () => { console.log('Disagree clicked'); } },
      {
        text: 'Confirm', handler: () => {
          this._groundFirebaseStoreService.removePhotoByUID(this.currentUserId, uid);
          console.log('Agree clicked');
        }
      }]
    });
    confirm.present();
  }

  uploadFile(event) {
    const file = event.target.files[0];
    const filePath = this.currentUserId; // uid
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
