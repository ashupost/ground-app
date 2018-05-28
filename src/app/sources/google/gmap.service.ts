import { Injectable } from '@angular/core';
import { MapsAPILoader } from '@agm/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { of } from 'rxjs/observable/of';
import { filter, catchError, tap, map, switchMap } from 'rxjs/operators';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { AddressUser } from '../model/userdetails';
import { Geoposition } from '@ionic-native/geolocation';

declare var google: any;

@Injectable()
export class GMapsService {
  private geocoder: any;

  constructor(private mapLoader: MapsAPILoader) { }

  private initGeocoder() {
    console.log('Init geocoder!');
    this.geocoder = new google.maps.Geocoder();
  }

  private waitForMapsToLoad(): Observable<boolean> {
    if (!this.geocoder) {
      return fromPromise(this.mapLoader.load())
        .pipe(tap(() => this.initGeocoder()), map(() => true));
    }
    return of(true);
  }

  geocodeAddress3(): Observable<any> {
    let location = 'Amsterdam';
    alert('2=>' + location);
    console.log('Start geocoding!');
    return this.waitForMapsToLoad().pipe(
      // filter(loaded => loaded),
      switchMap(() => {
        return new Observable(observer => {
          this.geocoder.geocode({ 'address': location }, (results, status) => {
            console.log('status', status);
            if (status == google.maps.GeocoderStatus.OK) {
              console.log('Geocoding complete!');
              observer.next({
                lat: results[0].geometry.location.lat(),
                lng: results[0].geometry.location.lng()
              });
            } else {
              console.log('Error - ', results, ' & Status - ', status);
              observer.next({});
            }
            observer.complete();
          });
        })
      })
    )
  }

private  getaddress(results: any): AddressUser {
    let storableLocation: any = {};
    for (let ac = 0; ac < results[0].address_components.length; ac++) {
      let component = results[0].address_components[ac];

      switch (component.types[0]) {
        case 'locality':
          storableLocation.city = component.long_name;
          break;
        case 'administrative_area_level_1':
          storableLocation.state = component.short_name;
          break;
        case 'country':
          storableLocation.country = component.long_name;
          storableLocation.country_iso_code = component.short_name;
          break;
        case 'route':
          storableLocation.street = component.long_name;
          break;
      }
    };
    return storableLocation
  }
 
  geocodeAddress(position: Geoposition): Observable<any> {
    let location = 'Amsterdam';
  //  alert('2=>' + location);
    console.log('Start geocoding!');
    return this.waitForMapsToLoad().pipe(
      // filter(loaded => loaded),
      switchMap(() => {
        return new Observable(observer => {
        //  var input = '52.3062812,4.977725899999996';
        //  var latlngStr = input.split(',', 2);
          let latlng = { lat: position.coords.latitude, lng: position.coords.longitude };
          this.geocoder.geocode({ 'location': latlng }, (results, status) => {
            console.log('status', status);
            if (status == google.maps.GeocoderStatus.OK) {
              console.log('Geocoding complete!');
              //console.log('result1 ->', JSON.stringify(this.getaddress(results)));
              observer.next(this.getaddress(results));
            } else {
              console.log('Error - ', results, ' & Status - ', status);
              observer.next(null);
            }
            observer.complete();
          });
        })
      })
    )
  }


}