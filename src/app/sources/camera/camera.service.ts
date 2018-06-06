import { Injectable } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera';

@Injectable()
export class CameraService {

     base64Image: any;

    constructor(private __camera: Camera) { }
    takePhoto() {
        const options: CameraOptions = {
            quality: 50,
            destinationType: this.__camera.DestinationType.DATA_URL,
            encodingType: this.__camera.EncodingType.JPEG,
            mediaType: this.__camera.MediaType.PICTURE
        };

       return  this.__camera.getPicture(options);
    }

    selectImageFromCamera() : Promise<any>
    {
       return new Promise(resolve =>
       {
          let cameraOptions : CameraOptions = {
              destinationType    : this.__camera.DestinationType.DATA_URL,
              quality            : 100,
              encodingType       : this.__camera.EncodingType.JPEG,
              mediaType:           this.__camera.MediaType.PICTURE
          };
          this.__camera.getPicture(cameraOptions)
          .then((data) => {
             resolve("data:image/jpeg;base64," + data);
          });
       });
    }
 

    getFileBase64(file) : Promise<{}>{
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = error => reject(error);
        });
      }
      
}
