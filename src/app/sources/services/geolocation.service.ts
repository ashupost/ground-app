import { Injectable } from '@angular/core';
import { Geolocation, GeolocationOptions } from '@ionic-native/geolocation';
import { Platform } from 'ionic-angular';

export class GeoCordinate {
    latitude: number;
    longitude: number;
    success: boolean;
    errorMessage?: string
} 

@Injectable()
export class GeolocationService {
 constructor(
    private _geolocation: Geolocation,
    private _platform: Platform){
 }

 _geoCordinate: GeoCordinate;
 
 getGeolocationCoordinate(): GeoCordinate {
     this._geoCordinate = new GeoCordinate();
    this._platform.ready().then(() => {
      const options: GeolocationOptions = {
        timeout: 5000
      };
      this._geolocation.getCurrentPosition(options).then((resp) => {
        this._geoCordinate.latitude = resp.coords.latitude;
        this._geoCordinate.longitude = resp.coords.longitude;
        this._geoCordinate.success = true;
             }).catch((error) => {
        this._geoCordinate.success = false;
        this._geoCordinate.errorMessage = 'error message ' + error;
      });
    });
    return this._geoCordinate;
  }

}