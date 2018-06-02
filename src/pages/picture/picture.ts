import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, DateTime } from 'ionic-angular';
import { AngularFireStorage } from 'angularfire2/storage';
import { Observable } from 'rxjs/Observable';
import { finalize } from 'rxjs/operators';
import { GroundFirebaseStoreService } from '../../app/sources/services/ground-firebasestore.service';
import { AngularFireAuth } from 'angularfire2/auth';
import { UserDetails, PictureDetail, PhotoStatus } from '../../app/sources/model/userdetails';
import * as firebase from 'firebase';
import { DatePipe } from '@angular/common';
import { CameraService } from '../../app/sources/camera/camera.service';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { UtilService } from '../../app/sources/services/util.service';



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
  structure: any = { lower: 33, upper: 60 };
  changeDate = '';
  base64Image: any;
  isCordova: boolean;
  // photos: Observable<any[]>;
  photos: any = [];


  @ViewChild('changeTime') changeDateTime: DateTime;
  //currentUserPhotoURL: Observable<string | null>;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public alertCtrl: AlertController,
    private __cameraService: CameraService,
    private __utilService: UtilService,
    private afAuth: AngularFireAuth,
    private _groundFirebaseStoreService: GroundFirebaseStoreService,
    private storage: AngularFireStorage) {
    this.isCordova = this.__utilService.isCordova();
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

  ionViewDidLoad() {
    console.log('ionViewDidLoad PicturePage');
    this.changeDateTime.updateText = () => { };
    this.afAuth.authState.subscribe(res => {
      if (res && res.uid) {
        this._groundFirebaseStoreService.getPhotoUserData(res.uid).subscribe(data => {
            this.photos = data;
          });
      }
    });
  }

  takePhoto($event: any | null) {
    if (this.isCordova) {
      this.__cameraService.takePhoto().then((imageData) => {
        // imageData is either a base64 encoded string or a file URI
        // If it's base64:
        this.base64Image = 'data:image/jpeg;base64,' + imageData;
        let value = new PictureDetail();
        value.data = this.base64Image;
        value.dataType = 'string';
        value.photoType = PhotoStatus.MAIN;
        this._groundFirebaseStoreService.setPhotoUserData(this.currentUserId, value);

      }, (err) => { console.log(err); });
    } else {
      this.__cameraService.getFileBase64($event.target.files[0]).then(data => {
        this.base64Image = data;
        let value = new PictureDetail();
        value.data = data;
        value.dataType = 'string';
        value.photoType = PhotoStatus.MAIN;
        this._groundFirebaseStoreService.setPhotoUserData(this.currentUserId, value);
      });
    }
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
