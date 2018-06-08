import { Injectable, NgZone } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable'
import { Subscription } from 'rxjs/Subscription'
import 'rxjs/add/observable/timer';
import 'rxjs/add/operator/throttleTime';
import { UserStatus } from '../model/userdetails';

@Injectable()
export class AuthServiceStatusService {

    private userId: string; // current user uid
    private mouseEvents: Subscription
    private timer: Subscription;

    constructor(
        private __zone: NgZone,
        private __afAuth: AngularFireAuth,
        private __afs: AngularFirestore,
        private __db: AngularFireDatabase) {
        this.__afAuth.authState
            .subscribe(user => {
                if (user) {
                    this.userId = user.uid
                    this.updateOnConnect(); // working
                    this.rtdb_and_local_fs_presence();
                    this.updateOnIdle()   // <-- new line added
                }
            });
    }

    private rtdb_and_local_fs_presence() {
        var uid = firebase.auth().currentUser.uid;
        var userStatusDatabaseRef = firebase.database().ref('/status/' + uid);

        var isOfflineForDatabase = {
            status: UserStatus.OFFLINE,
            timestamp: firebase.database.ServerValue.TIMESTAMP
        };

        var isOnlineForDatabase = {
            status: UserStatus.IDLE,
            timestamp: firebase.database.ServerValue.TIMESTAMP
        };

        firebase.database().ref('.info/connected').on('value', function (snapshot) {
            if (snapshot.val() == false) {
                // Instead of simply returning, we'll also set Firestore's state
                // to 'offline'. This ensures that our Firestore cache is aware
                // of the switch to 'offline.'
                //  userStatusFirestoreRef.update(isOfflineForFirestore);
                return;
            };

            userStatusDatabaseRef.onDisconnect().set(isOfflineForDatabase).then(function () {
                userStatusDatabaseRef.set(isOnlineForDatabase);

                // We'll also add Firestore set here for when we come online.
                //  userStatusFirestoreRef.update(isOnlineForFirestore);
            });
        });
    }

    private get timestamp() {
        return firebase.firestore.FieldValue.serverTimestamp();

    }

    private updateOnIdle() {
        this.mouseEvents = Observable.fromEvent<MouseEvent>(document, 'mousemove')
            .map(event => event.timeStamp)
            .debounceTime(2000)
            .distinctUntilChanged()
            .throttleTime(2000)
            .subscribe(() => {
                this.updateStatus(UserStatus.ONLINE);
                this.resetTimer()
            });

    }

    private updateStatus(status: string) { // working
        if (!status) return;
        if (!this.userId) return
        this.__zone.run(() => {
            try {
                this.__afs.collection('users').doc(this.userId)
                    .update({ status: status, timestamp: this.timestamp });
            } catch (error) { }
        });
    }

    private updateOnConnect() { // working
        return this.__db.object('.info/connected').snapshotChanges()
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
    public signOut() {
        this.updateStatus(UserStatus.SIGNOUT);
           this.__afAuth.auth.signOut();
        if (this.mouseEvents) this.mouseEvents.unsubscribe();
        if (this.timer) this.timer.unsubscribe();
    }
}
