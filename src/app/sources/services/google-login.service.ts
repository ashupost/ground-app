import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { GooglePlus } from '@ionic-native/google-plus';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

@Injectable()
export class GoogleLoginService {
    constructor(
        private __platform: Platform,
        private __googlePlus: GooglePlus,
        private __afAuth: AngularFireAuth) {
    }

    googlePlusLogin() {
        if (this.__platform.is('cordova')) {
            this.nativeGoogleLogin();
        } else {
            this.webGoogleLogin();
        }
    }
    private async nativeGoogleLogin(): Promise<void> {
        try {
            const gplusUser = await this.__googlePlus.login({
                'webClientId': '329915457638-4648vo7u1kukboqe1e35te5u2e15hhpo.apps.googleusercontent.com',
                'offline': true,
                'scopes': 'profile email'
            });
            return await this.__afAuth.auth.signInWithCredential(firebase.auth.GoogleAuthProvider.credential(gplusUser.idToken));
        } catch (err) {
            alert('Google Plus error' + err);
        }
    }

    private async webGoogleLogin(): Promise<void> {
        try {
            const provider = new firebase.auth.GoogleAuthProvider();
            return await this.__afAuth.auth.signInWithPopup(provider);

        } catch (err) {
            alert('Google Plus error' + err);
        }
    }
    logout() {
        this.__afAuth.auth.signOut();
    }
}