import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';

import * as firebase from 'firebase/app';

@Injectable()
export class FaceBookLoginService {
    constructor(
        private _platform: Platform,
        private facebook: Facebook,
        private afAuth: AngularFireAuth) {
    }

    facebookLogin() {
        if (this._platform.is('cordova')) {
            this.facebookLoginCordova();
        } else {
            this.facebookLoginWeb();
        }
    }


    async facebookLoginCordova(): Promise<void> {
        try {
            this.facebook.login(['public_profile', 'email'])
                .then((response: FacebookLoginResponse) => {
                    let creadet = firebase.auth.FacebookAuthProvider.credential(response.authResponse.accessToken);
                    return this.afAuth.auth.signInWithCredential(creadet);
                });
        } catch (err) {
            alert('FaceBook Login error Cordova' + err);
        }
    }

    async facebookLoginWeb(): Promise<void> {
        try {
            const provider = new firebase.auth.FacebookAuthProvider();
            return await this.afAuth.auth.signInWithPopup(provider);
        } catch (err) {
            alert('FaceBook Login error web' + err);
        }
    }

    logout() {
        this.afAuth.auth.signOut();
    }
}