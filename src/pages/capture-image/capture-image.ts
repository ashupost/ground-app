import { Component, NgZone, ViewChild } from '@angular/core';
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
export class CaptureImagePage {

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
      this.cropperSettings = new CropperSettings();
      this.cropperSettings.width = 50;
    this.cropperSettings.height = 50;
    this.cropperSettings.croppedWidth = 100;
    this.cropperSettings.croppedHeight = 100;
  //  this.cropperSettings.canvasWidth = 400;
   // this.cropperSettings.canvasHeight = 300;
   this.cropperSettings.cropOnResize = true;
 
   

      this.cropperSettings.dynamicSizing = true;
      this.cropperSettings.noFileInput = true;
      this.cropperSettings._rounded = false;
     // this.cropperSettings.touchRadius = 10;
     this.cropperSettings.markerSizeMultiplier = 2;
     this.cropperSettings.cropperDrawSettings.strokeColor = 'rgba(55,55,255,1)';
     this.cropperSettings.cropperDrawSettings.strokeWidth = 2;

      
      this.data = {};
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
        // Create an Image object, assign retrieved base64 image from
        // the device photo library
        let image: any = new Image();
        image.src = data;
        // Assign the Image object to the ImageCropper component
        this.ImageCropper.setImage(image);
      })
      .catch((error: any) => {
        console.dir(error);
      });
  }
  onClick(){

  }
  saveImage() {
    console.dir(this.data.image);
  }

  fileChangeListener($event) {
    let image: any = new Image();
    let file: File = $event.target.files[0];
    let myReader: FileReader = new FileReader();
    let that = this;
    myReader.onload = function (loadEvent: any) {
      image.src = loadEvent.target.result;
      that.ImageCropper.setImage(image);

    };
    myReader.readAsDataURL(file);
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
