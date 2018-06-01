import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable'
import { Subscription } from 'rxjs/Subscription'
import 'rxjs/add/observable/timer';
import 'rxjs/add/operator/throttleTime';
import { UserStatus, UserDetails } from '../model/userdetails';
import { Action } from 'angularfire2/firestore';


@Injectable()
export class AuthServiceStatusService {

    userId: string; // current user uid
    mouseEvents: Subscription
    timer: Subscription;
    constructor(private afAuth: AngularFireAuth,
        private _angularFirestore: AngularFirestore,
        private db: AngularFireDatabase) {

        /// Subscribe to auth state in firebase
        this.afAuth.authState
            .subscribe(user => {
                if (user) {
                    this.userId = user.uid
                   // this.updateOnConnect(); // working
                    this.rtdb_and_local_fs_presence();
                    //this.updateOnIdle()   // <-- new line added
                   
                }
            });
    }


    rtdb_and_local_fs_presence() {
        var uid = firebase.auth().currentUser.uid;
        var userStatusDatabaseRef = firebase.database().ref('/status/' + uid);

        var isOfflineForDatabase = {
            status: UserStatus.OFFLINE,
            timestamp: firebase.database.ServerValue.TIMESTAMP,
        };

        var isOnlineForDatabase = {
            status: UserStatus.IDLE,
            timestamp: firebase.database.ServerValue.TIMESTAMP,
        };
       var userStatusFirestoreRef = firebase.firestore().doc('users/' + uid);

        // Firestore uses a different server timestamp value, so we'll 
        // create two more constants for Firestore state.
        var isOfflineForFirestore = {
            status: UserStatus.OFFLINE,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        };

        var isOnlineForFirestore = {
            status: UserStatus.IDLE,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        };

        firebase.database().ref('.info/connected').on('value', function(snapshot) {
            if (snapshot.val() == false) {
                // Instead of simply returning, we'll also set Firestore's state
                // to 'offline'. This ensures that our Firestore cache is aware
                // of the switch to 'offline.'
              //  userStatusFirestoreRef.update(isOfflineForFirestore);
                return;
            };
    
            userStatusDatabaseRef.onDisconnect().set(isOfflineForDatabase).then(function() {
                userStatusDatabaseRef.set(isOnlineForDatabase);
    
                // We'll also add Firestore set here for when we come online.
               //  userStatusFirestoreRef.update(isOnlineForFirestore);
            });
        });
        }


    get timestamp() {
        return firebase.firestore.FieldValue.serverTimestamp();

    }

    private updateOnIdle() {
        this.mouseEvents = Observable.fromEvent(document, 'mousemove')
            .throttleTime(2000)
            .subscribe(() => {
                this.updateStatus(UserStatus.ONLINE);
                this.resetTimer()
            });

    }


    /// Helper to perform the update in Firebase
    private updateStatus(status: string) { // working
        console.log('status =>', status);
        if (!status) return;
        if (!this.userId) return
        this._angularFirestore.collection('users').doc(this.userId)
            .update({ status: status, timestamp: this.timestamp });
    }


    private updateOnConnect() { // working
        return this.db.object('.info/connected').snapshotChanges()
            .subscribe(connected => {
                let status = connected.payload.val ? UserStatus.ONLINE : UserStatus.OFFLINE;
                this.updateStatus(status)
            });
    }


    /// Reset the timer
    private resetTimer() {
        if (this.timer) this.timer.unsubscribe()

        this.timer = Observable.timer(5000)
            .subscribe(() => {
                this.updateStatus(UserStatus.DISCONNECT)
            });

    }

    /// Make sure to close these subscriptions when no longer needed.
    signOut() {
        this.updateStatus(UserStatus.SIGNOUT);
        this.mouseEvents.unsubscribe();
        this.timer.unsubscribe();
        this.afAuth.auth.signOut();
    }

}
