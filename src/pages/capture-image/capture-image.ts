import { Component, NgZone, ViewChild, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
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
  base64Image: any;
  user: Observable<firebase.User>;
  currentUserId: string;
  @ViewChild('cropper', undefined) ImageCropper: ImageCropperComponent;
  public cropperSettings;
  public croppedWidth: Number;
  public croppedHeight: Number;
  public data: any;
  public canSave: boolean = true;
  // $event: any;

  constructor(public navCtrl: NavController,
    private __utilService: UtilService,
    private __zone: NgZone,
    private __cameraService: CameraService,

    private _groundFirebaseStoreService: GroundFirebaseStoreService,

    private afAuth: AngularFireAuth,

    public _navParams: NavParams) {
    this.isCordova = this.__utilService.isCordova();
    this.user = this.afAuth.authState;
    this.afAuth.authState.subscribe(res => {
      if (res && res.uid) {
        this.currentUserId = res.uid;
      }
    });
    // this.$event = this._navParams.get('event'); // my user
    //this.fileChangeListener(this.$event);  
  }
  cropPosition: CropPosition;
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

  selectImage() {
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
  onClick() {
 
  }
  saveImage() {
    console.dir(this.data.image);
    let value = new PictureDetail();
    value.data = this.data.image;
    value.dataType = 'string';
    value.photoType = PhotoStatus.MAIN;
    this._groundFirebaseStoreService.setPhotoUserData(this.currentUserId, value);
  }

  fileChangeListener($event) {
    this.__cameraService.getFileBase64($event.target.files[0]).then(loadEvent => {
      let image: any = new Image();
      image.src = loadEvent;
      this.ImageCropper.setImage(image);
    });
  }


  takePhoto($event: any | null) {
    this.__zone.run(() => {
      if (this.isCordova) {
        this.__cameraService.selectImageFromGallary().then((imageData) => {
          this.base64Image = imageData;
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
    });

  }


}
