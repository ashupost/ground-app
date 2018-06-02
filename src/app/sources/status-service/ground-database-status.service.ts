import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable'
import { Subscription } from 'rxjs/Subscription'
import 'rxjs/add/observable/timer';
import 'rxjs/add/operator/throttleTime';
import { UserDetails, OnlineStatus } from '../model/userdetails';
import { Action } from 'angularfire2/firestore';


@Injectable()
export class GroundDatabaseStatusService {

    constructor(private afAuth: AngularFireAuth,
        private _angularFirestore: AngularFirestore,
        private db: AngularFireDatabase) {
    }


    getUserByid(uid: string) {
        //  alert('uid=>'+ uid);
        //      this.setStatusOnFireStore(uid); // set latest data from database
        //       return this._angularFirestore.collection<UserDetails>('users').doc<UserDetails>(uid).valueChanges();

    }



    private setStatusOnFireStore(uid: string) {
        //  alert('uid2=>'+ uid);
        this.getStatusFromDatabase(uid).subscribe((data) => {
            //    data.timestamp;
            //    data.status;
            //   alert('data.status=>'+ data.status);

            if (data.status === 'danger') {
                this._angularFirestore.collection<UserDetails>('users')
                    .doc(uid).snapshotChanges()
                    .subscribe((value: Action<firebase.firestore.DocumentSnapshot>) => {
                        if (value.payload.exists === true) {
                            //   alert('value.payload.exists=>'+ value.payload.exists);
                            this._angularFirestore.collection<UserDetails>('users')
                                .doc(uid).update({ status: data.status });
                        }
                    });
            }
        });
    }

    private getStatusFromDatabase(uid: string): Observable<OnlineStatus> {
        return this.db.object<OnlineStatus>('status/' + uid).valueChanges();
    }



}
