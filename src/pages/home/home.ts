import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';

import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

import { Platform } from 'ionic-angular';
import { GooglePlus } from '@ionic-native/google-plus';
import { Observable } from 'rxjs/Observable'

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  // displayName;
  userInfo: any = {};
  myJson: any;
  user: Observable<firebase.User>;
  public recaptchaVerifier: firebase.auth.RecaptchaVerifier;

  constructor(public navCtrl: NavController,
    private afAuth: AngularFireAuth, private platform: Platform,
    private _googlePlus: GooglePlus,
    private alertCtrl: AlertController) {

    this.user = this.afAuth.authState;
  }
  userData1;

  googlePlusLogin() {
    if (this.platform.is('cordova')) {
      this.nativeGoogleLogin();
    } else {
      this.webGoogleLogin();
    }
  }
  async nativeGoogleLogin(): Promise<void> {
    try {
      const gplusUser = await this._googlePlus.login({
        'webClientId': '329915457638-4648vo7u1kukboqe1e35te5u2e15hhpo.apps.googleusercontent.com',
        'offline': true,
        'scopes': 'profile email'
      });

      return await this.afAuth.auth.signInWithCredential(firebase.auth.GoogleAuthProvider.credential(gplusUser.idToken));

    } catch (err) {
      alert('Google Plus error' + err);
    }
  }

  async webGoogleLogin(): Promise<void> {
    try {

      const provider = new firebase.auth.GoogleAuthProvider();
      return await this.afAuth.auth.signInWithPopup(provider);

    } catch (err) {
      alert('Google Plus error' + err);
    }
  }


  signInWithFacebook() {

    this.afAuth.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider()).then(res => {
      //  alert('FaceBook Res' + res);
      //this.userData1=res.user;
    }).catch((error) => alert('error=' + error));

  }

  signOut() {
    this.afAuth.auth.signOut();
    this.userInfo = {};
  }

  logout() {
    this.afAuth.auth.signOut();
  }

  ionViewDidLoad() {
    this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('sign-in-button', {
      'size': 'invisible',
      'callback': function (response) {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
        //alert(response);
        //  onSignInSubmit();
      }
    });

  }

  signInPhone(phoneNumber: number) {
    const appVerifier = this.recaptchaVerifier;
    const phoneNumberString = "+" + phoneNumber;
    this.afAuth.auth.signInWithPhoneNumber(phoneNumberString, appVerifier)
      .then(confirmationResult => {
        // SMS sent. Prompt user to type the code from the message, then sign the
        // user in with confirmationResult.confirm(code).
        let prompt = this.alertCtrl.create({
          title: 'Enter the Confirmation code',
          inputs: [{ name: 'confirmationCode', placeholder: 'Confirmation Code' }],
          buttons: [
            {
              text: 'Cancel',
              handler: data => { console.log('Cancel clicked'); }
            },
            {
              text: 'Send',
              handler: data => {
                confirmationResult.confirm(data.confirmationCode)
                  .then(function (result) {
                    // User signed in successfully.
                    console.log(result.user);
                    alert('User success =' + result.user);
                    // ...
                  }).catch(function (error) {
                    // User couldn't sign in (bad verification code?)
                    alert('Invalied code');
                    // ...
                  });
              }
            }
          ]
        });
        prompt.present();
      })
      .catch(function (error) {
        console.error("SMS not sent", error);

      });

  }



}


