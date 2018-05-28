import { Injectable, NgZone } from '@angular/core';
import { GoogleMapsAPIWrapper } from '@agm/core';
import { MapsAPILoader } from '@agm/core';
import { Observable, Observer } from 'rxjs';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { filter, catchError, tap, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
declare var google: any;

@Injectable()
export class GMapsWapperService extends GoogleMapsAPIWrapper {
    // https://github.com/SebastianM/angular-google-maps/issues/689
    constructor(private __loader: MapsAPILoader, private __zone: NgZone) {
        super(__loader, __zone);
    }
    private geocoder: any;

    private initGeocoder() {
        console.log('Init geocoder!');
        this.geocoder = new google.maps.Geocoder();
    }

    private waitForMapsToLoad(): Observable<boolean> {
        if (!this.geocoder) {
            return fromPromise(this.__loader.load())
                .pipe(tap(() => this.initGeocoder()), map(() => true));
        }
        return of(true);
    }


    getLatLan() : Observable<any>{
        let address = 'Amsterdam';
  

        console.log('Getting Address - ', address);
        // let geocoder = new google.maps.Geocoder();

        return this.waitForMapsToLoad().pipe(
            // filter(loaded => loaded),
            switchMap(() => {
                return Observable.create(observer => {
                    this.geocoder.geocode({ 'address': address }, function (results, status) {
                        if (status == google.maps.GeocoderStatus.OK) {
                            console.log('MK2 done');
                            observer.next(results[0].geometry.location);
                            observer.complete();
                        } else {
                            console.log('Error - ', results, ' & Status - ', status);
                            observer.next({});
                            observer.complete();
                        }
                    });
                });
            }));
    }
}