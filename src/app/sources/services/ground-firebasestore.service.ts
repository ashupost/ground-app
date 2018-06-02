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

export class GroundFirebaseStoreService {
    constructor(private __zone: NgZone,
        private __afs: AngularFirestore
    ) { }

    getPhotoUserData(userId: string): Observable<any[]> {
        let timestamp$ = new BehaviorSubject(null);
        return Observable.combineLatest(
            timestamp$
        ).switchMap(([timestamp]) =>
            this.__afs.collection<any>('photos')
                .doc(userId)
                .collection('photo', ref => {
                    let query: firebase.firestore.Query = ref;
                    query = query.orderBy('timestamp', 'asc');
                    return query;
                })
                .snapshotChanges().map(actions => {
                    return actions.map(a => {
                        const data = a.payload.doc.data();
                        data.uid = a.payload.doc.id;
                        return { ...data };
                    });
                }));
    }

    setPhotoUserData(userId: string, value: PictureDetail) {
        this.__zone.run(() => {
            let data = JSON.parse(JSON.stringify(value));
            data.timestamp = firebase.firestore.FieldValue.serverTimestamp();
            this.__afs.collection<PictureDetail>('photos')
                .doc(userId).collection('photo').add(data);
        });
    }

    setSettingData(userId: string, value: string, param: string) {
        let data = {};
        let timestamp = firebase.firestore.FieldValue.serverTimestamp();
        switch (param) {
            case 'interest_in':
                data = { interest_in: value, timestamp: timestamp };
                break;
            case 'age_lower':
                data = { age_lower: value, timestamp: timestamp };
                break;
            case 'age_upper':
                data = { age_upper: value, timestamp: timestamp };
                break;
            default:
                data = { param: value, timestamp: timestamp };
        }
        this.__zone.run(() => {
            this.__afs.collection<UserDetails>('settings').doc(userId).set(data, { merge: true });
        });
    }


    setUserData(userId: string, value: string, param: string) {
        let data = {};
        let timestamp = firebase.firestore.FieldValue.serverTimestamp();
        switch (param) {
            case 'gender':
                data = { gender: value, timestamp: timestamp };
                break;
            case 'dob':
                data = { dob: value, timestamp: timestamp };
                break;
            case 'name':
                data = { name: value, timestamp: timestamp };
                break;

            default:
                data = { param: value, timestamp: timestamp };
        }
        this.__zone.run(() => {
            this.__afs.collection<UserDetails>('users').doc(userId).set(data, { merge: true });
        });
    }

    updatePhotoURL(userId: string, value: string) {
        let timestamp = firebase.firestore.FieldValue.serverTimestamp();
        this.__zone.run(() => {
            this.__afs.collection<UserDetails>('users')
                .doc(userId)
                .update({
                    photoURL: value,
                    timestamp: timestamp
                });
        });
    }


    getLatestGeoCordinidateByUsers(userid: string): Observable<GeoCordinate[]> {
        return this.__afs.collection<UserDetails>('users')
            .doc(userid).collection('geolocation', ref => {
                let query: firebase.firestore.Query = ref;
                query = query.orderBy('timestamp', 'desc').limit(1);
                return query;

            }).snapshotChanges().map(actions => {
                return actions.map(a => {
                    const data = a.payload.doc.data() as GeoCordinate;
                    //const id = a.payload.doc.id; // this is firebase generated id.
                    data.docId = a.payload.doc.id;
                    return { ...data };
                });
            });
    }

    getMessages(myId: string, otherId: string): Observable<any[]> {
        let timestamp$ = new BehaviorSubject(null);
        // let colorFilter$ = new BehaviorSubject(null);
        return Observable.combineLatest(
            timestamp$
        ).switchMap(([timestamp]) =>
            this.__afs.collection<UserDetails>('users')
                .doc(myId).collection('messages').doc(otherId).collection('chat', ref => {
                    let query: firebase.firestore.Query = ref;
                    query = query.orderBy('timestamp', 'asc');
                    return query;
                })
                .snapshotChanges().map(actions => {
                    return actions.map(a => {
                        const data = a.payload.doc.data();
                        // console.log('data', JSON.stringify(data));
                        data.uid = a.payload.doc.id;
                        //const id = a.payload.doc.id; // this is firebase generated id.
                        return { ...data };
                    });
                }));
    }




    sendMessage(toId: string, fromId: string, newMessage: string) {
        this.__zone.run(() => {
            // const merge: firebase.firestore.SetOptions = { merge: false };
            let timestamp = firebase.firestore.FieldValue.serverTimestamp();
            this.__afs.collection<UserDetails>('users')
                .doc(toId).collection('messages').doc(fromId).collection('chat')
                .add({
                    toId: toId,
                    fromId: fromId,
                    message: newMessage,
                    timestamp: timestamp
                });
            this.__afs.collection<UserDetails>('users')
                .doc(fromId).collection('messages').doc(toId).collection('chat')
                .add({
                    toId: toId,
                    fromId: fromId,
                    message: newMessage,
                    timestamp: timestamp
                });
        });
    }

    getUserByid(id: string): Observable<UserDetails> {
        return this.__afs.collection<any>('users')
            .doc<UserDetails>(id).valueChanges();

    }

    addUsers(userDetails: UserDetails) {
        this.__zone.run(() => {
            this.__afs.collection<UserDetails>('users')
                .doc(userDetails.uid).snapshotChanges()
                .subscribe((value: Action<firebase.firestore.DocumentSnapshot>) => {
                    if (value.payload.exists !== true) {
                        let data = JSON.parse(JSON.stringify(userDetails));
                        data.timestamp = firebase.firestore.FieldValue.serverTimestamp();
                        this.__afs.collection<UserDetails>('users')
                            .doc(userDetails.uid).set(data);
                    }
                });
        });
    }

    public getUsers(): Observable<UserDetails[]> {
        return this.__afs.collection<UserDetails>('users', ref => {
            let query: firebase.firestore.Query = ref;
            query = query.orderBy('timestamp', 'desc').limit(300);
            return query;
        }).snapshotChanges(['added', 'removed', 'modified'])
            .pipe()
            .map(actions => actions.map(a => {
                const data = a.payload.doc.data() as UserDetails;
                //const id = a.payload.doc.id; // this is firebase generated id.
                data.docId = a.payload.doc.id;
                return { ...data };
            }));
    }

    public getUsersOnline(): Observable<UserDetails[]> {
        return this.__afs.collection<UserDetails>('users', ref => {
            let query: firebase.firestore.Query = ref;
            query = query.where('status', '==', UserStatus.ONLINE);
            query = query.orderBy('timestamp', 'desc').limit(300);
            return query;
        }).snapshotChanges(['added', 'removed', 'modified'])
            .pipe()
            .map(actions => actions.map(a => {
                const data = a.payload.doc.data() as UserDetails;
                //const id = a.payload.doc.id; // this is firebase generated id.
                data.docId = a.payload.doc.id;
                return { ...data };
            }));
    }
}