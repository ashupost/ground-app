import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable'
import 'rxjs/add/observable/timer';
import 'rxjs/add/operator/throttleTime';
import { UserDetails, OnlineStatus } from '../model/userdetails';
import { Action } from 'angularfire2/firestore';


@Injectable()
export class GroundDatabaseStatusService {

    constructor(private _angularFirestore: AngularFirestore,
        private db: AngularFireDatabase) {
    }

    private setStatusOnFireStore(uid: string) {
        this.getStatusFromDatabase(uid).subscribe((data) => {
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
