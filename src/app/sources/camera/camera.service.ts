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

    getFileBase64(file) {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = error => reject(error);
        });
      }
      
}
