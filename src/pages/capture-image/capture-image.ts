import { Component, NgZone, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, LoadingController } from 'ionic-angular';
import { UtilService } from '../../app/sources/services/util.service';
import { CameraService } from '../../app/sources/camera/camera.service';
import { PictureDetail, PhotoStatus } from '../../app/sources/model/userdetails';
import { GroundFirebaseStoreService } from '../../app/sources/services/ground-firebasestore.service';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-capture-image',
  templateUrl: 'capture-image.html',
})
export class CaptureImagePage implements OnInit {

  ngOnInit() {
  }

  isCordova: boolean;
  user: Observable<firebase.User>;
  currentUserId: string;

  
  constructor(private __navCtrl: NavController,
    private __utilService: UtilService,
    private __zone: NgZone,
    private __cameraService: CameraService,
    private _groundFirebaseStoreService: GroundFirebaseStoreService,
    private afAuth: AngularFireAuth,
    private __loadingCtrl: LoadingController,
    public _navParams: NavParams) {
      this.__utilService.isCordova().then(value=>{
        this.isCordova = value;
      });
   
    this.user = this.afAuth.authState;
    this.afAuth.authState.subscribe(res => {
      if (res && res.uid) {
        this.currentUserId = res.uid;
      }
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CaptureImagePage');
  }

  selectImageFromCamera() {
    this.__cameraService.selectImageFromCamera()
      .then((data: any) => {
       this.imageBase64Data=data;
      })
      .catch((error: any) => {
        console.dir(error);
      });
  }
  selectImageFromGallary() {
    this.__cameraService.selectImageFromGallary()
      .then((data: any) => {
        this.imageBase64Data=data;
      })
      .catch((error: any) => {
        console.dir(error);
      });
  }


  saveImage() {
  
   let loading = this.__loadingCtrl.create({ content: 'Please wait saving...'  });
   loading.present();
    let value = new PictureDetail();
    value.data = this.croppedImage; // This is base64 image string to store in db.
    value.dataType = 'string';
    value.photoType = PhotoStatus.MAIN;

    this.__zone.run(() => {
      this._groundFirebaseStoreService.setPhotoUserData(this.currentUserId, value);
      this._groundFirebaseStoreService.updatePhotoURL(this.currentUserId, this.croppedImage);
    });
    setTimeout(() => { 
      loading.dismiss(); 
      this.__navCtrl.pop(); // close this page
    }, 3000);
    
  }

  imageChangedEvent: any = '';
  croppedImage: any = '';
  cropperReady = false;
  imageBase64Data: any;

fileChangeEvent($event) {
  this.imageChangedEvent = $event;
}

  imageCropped(image: string) {
    this.croppedImage = image;
}
imageLoaded() {
  this.cropperReady = true;
}
imageLoadFailed () {
  console.log('Load failed');
}

}
