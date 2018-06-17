import { Injectable } from '@angular/core';
import { AlertController, NavController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

@Injectable()
export class PhoneLoginService {

  constructor(
    private alertCtrl: AlertController,
   // private __navCtrl: NavController,
    private afAuth: AngularFireAuth) {

  }


  signInPhone(phoneNumber: number, recaptchaVerifier: firebase.auth.RecaptchaVerifier) {
    const alertPrompt = this.alertCtrl.create({
      title: 'Invalid Confirmation Code!',
      subTitle: 'The SMS verification code used is invalid. Please resend the verification code sms and be sure use the verification code provided by you.',
      buttons: ['OK']
    });
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
                confirmationResult.confirm(data.confirmationCode).then(function (result) {
                    console.log(result.user);
                    alert(result.user);
                   // prompt.dismiss();
                  // this.dismiss();
                    //this.__navCtrl.pop(); // close this page
                    // User signed in successfully.
                  }).catch((error) => {
                    // User couldn't sign in (bad verification code?)
                    alertPrompt.present();
                    console.log(error);
                   // alert('Invalied code=>'+ error);
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