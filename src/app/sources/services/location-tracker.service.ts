import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { NgZone } from '@angular/core';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import 'rxjs/add/operator/filter';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class LocationTrackerService {
    private watch: any;
    public lat: number = 0;
    public lng: number = 0;

    constructor(public __zone: NgZone,
        public __geolocation: Geolocation) {
    }

    startTracking($storeKey?: string | null) {
        let options = {
            frequency: 3000,
            enableHighAccuracy: true
        };

        this.watch = this.__geolocation.watchPosition(options)
            .filter((p: any) => p.code === undefined)
            .subscribe((position: Geoposition) => {
                this.__zone.run(() => {
                    this.lat = position.coords.latitude;
                    this.lng = position.coords.longitude;
                });
            });
       
    }
    private stopTracking() {
        this.watch.unsubscribe();
    }
}