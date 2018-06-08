import { Component, NgZone, ViewChild, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, App, Platform } from 'ionic-angular';
import { UtilService } from '../../app/sources/services/util.service';
import { CameraService } from '../../app/sources/camera/camera.service';
import { PictureDetail, PhotoStatus } from '../../app/sources/model/userdetails';
import { GroundFirebaseStoreService } from '../../app/sources/services/ground-firebasestore.service';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase';
import { ImageCropperComponent, CropperSettings, Bounds, CropPosition } from "ngx-img-cropper";

@IonicPage()
@Component({
  selector: 'page-capture-image',
  templateUrl: 'capture-image.html',
})
export class CaptureImagePage implements OnInit {

  ngOnInit() {
    this.cropperSettings = new CropperSettings();
    this.cropperSettings.width = 50;
    this.cropperSettings.height = 50;
    this.cropperSettings.croppedWidth = 512;
    this.cropperSettings.croppedHeight = 512;
    this.cropperSettings.minWidth = 100;
    this.cropperSettings.minHeight = 100;
    this.cropperSettings.cropOnResize = true;
    this.cropperSettings.dynamicSizing = true;
    this.cropperSettings.noFileInput = true;
    this.cropperSettings._rounded = false;
    this.cropperSettings.touchRadius = 30;
    this.cropperSettings.centerTouchRadius = 40;
    this.cropperSettings.markerSizeMultiplier = 2;
    this.cropperSettings.cropperDrawSettings.strokeColor = 'rgba(255, 0, 0, 1)';
    this.cropperSettings.cropperDrawSettings.strokeWidth = 2;
    this.data = {};
  }

  isCordova: boolean;
  //base64Image: any;
  user: Observable<firebase.User>;
  currentUserId: string;
  @ViewChild('cropper', undefined) ImageCropper: ImageCropperComponent;

  public cropperSettings;
  public croppedWidth: Number;
  public croppedHeight: Number;
  public data: any;
  public canSave: boolean = true;

  constructor(public navCtrl: NavController,
    private __utilService: UtilService,
    private __zone: NgZone,
    private __cameraService: CameraService,
    private _groundFirebaseStoreService: GroundFirebaseStoreService,
    private afAuth: AngularFireAuth,
    private __platform: Platform,
    public _navParams: NavParams) {
    this.__platform.ready().then(() => {
      if (this.__platform.is('cordova')) this.isCordova = true;
      else this.isCordova = false;
    });
    this.user = this.afAuth.authState;
    this.afAuth.authState.subscribe(res => {
      if (res && res.uid) {
        this.currentUserId = res.uid;
      }
    });
  }
  /*
    cropped(bounds: Bounds) {
      this.croppedHeight = bounds.bottom - bounds.top;
      this.croppedWidth = bounds.right - bounds.left;
      this.canSave = false;
    }
    */

  ionViewDidLoad() {
    console.log('ionViewDidLoad CaptureImagePage');
  }

  selectImageFromCamera() {
    this.canSave = false;
    this.__cameraService.selectImageFromCamera()
      .then((data: any) => {
        let image: any = new Image();
        image.src = data;
        this.ImageCropper.setImage(image);
      })
      .catch((error: any) => {
        console.dir(error);
      });
  }
  selectImageFromGallary() {
    this.canSave = false;
    this.__cameraService.selectImageFromGallary()
      .then((data: any) => {
        let image: any = new Image();
        image.src = data;
        this.ImageCropper.setImage(image);
      })
      .catch((error: any) => {
        console.dir(error);
      });
  }


  saveImage() {
    console.dir(this.data.image);
    let value = new PictureDetail();
    value.data = this.data.image;
    value.dataType = 'string';
    value.photoType = PhotoStatus.MAIN;
    this.__zone.run(() => {
      this._groundFirebaseStoreService.setPhotoUserData(this.currentUserId, value);
      this._groundFirebaseStoreService.updatePhotoURL(this.currentUserId, this.data.image);
    });
  }

  fileChangeListener($event) {
    this.__cameraService.getFileBase64($event.target.files[0]).then(loadEvent => {
      let image: any = new Image();
      image.src = loadEvent;
      this.ImageCropper.setImage(image);
    });
  }
}
