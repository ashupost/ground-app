import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

@Injectable()
export class PhoneLoginService {

  constructor(
    private alertCtrl: AlertController,
    private afAuth: AngularFireAuth) {

  }


  signInPhone(phoneNumber: number, recaptchaVerifier: firebase.auth.RecaptchaVerifier) {
    const phoneNumberString = "+" + phoneNumber;
    this.afAuth.auth.signInWithPhoneNumber(phoneNumberString, recaptchaVerifier)
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
                    console.log(result.user);
                    // User signed in successfully.
                  }).catch(function (error) {
                    // User couldn't sign in (bad verification code?)
                    alert('Invalied code');
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