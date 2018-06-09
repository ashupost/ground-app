import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { UserDetails, GeoCordinate, UserStatus, PictureDetail } from '../model/userdetails';
import { AngularFirestore, Action } from 'angularfire2/firestore';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/combineLatest';
import 'firebase/firestore';
import * as firebase from 'firebase/app';


@Injectable()
export class MovieService {
    constructor(private __zone: NgZone,
        private __afs: AngularFirestore
    ) {
    }
    public getUsers(batch, lastKey?): Observable<UserDetails[]> {
        return this.__afs.collection<UserDetails>('users', ref => {
            let query: firebase.firestore.Query = ref;
            query = query.orderBy('uid');
            if (lastKey) query = query.startAfter(lastKey)
            query = query.limit(batch);
            return query;
        }).valueChanges();
    }
}


