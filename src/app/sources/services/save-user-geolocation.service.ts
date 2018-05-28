import { Injectable, NgZone } from '@angular/core';
import { UserDetails } from '../model/userdetails';
import { AngularFirestore } from 'angularfire2/firestore';
import 'firebase/firestore';
import * as firebase from 'firebase';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';


@Injectable()
export class SaveUserGeolocationService {
    private watch: any;
    constructor(private _angularFirestore: AngularFirestore,
        private geolocation: Geolocation,
        private  zone: NgZone
      
    ) { }
    private stop: number = 0;
    setGeoCoordinate(userId: string) {
        let options = { frequency: 3000, enableHighAccuracy: true };

        this.watch = this.geolocation.watchPosition(options)
            .filter((p: any) => p.code === undefined)
            .subscribe((position: Geoposition) => {
                this.zone.run(() => {
                    if(this.stop === 0){
                    this.stop = position.coords.latitude;
                    let timestamp = firebase.firestore.FieldValue.serverTimestamp();
                    this._angularFirestore.collection<UserDetails>('users')
                    .doc(userId).collection('geolocation')
                    .add({
                            latitude: position.coords.latitude, 
                            longitude: position.coords.longitude,
                            timestamp: timestamp
                     });
                }
            }
            
            );
        });
       setTimeout(()=>{ this.watch.unsubscribe(); }, 30000);
       if(this.stop !== 0)  { this.watch.unsubscribe();}
    }

}