import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { PhoneLoginService } from '../../app/sources/services/phone-login.service';


@IonicPage()
@Component({
  selector: 'page-modal',
  templateUrl: 'modal.html',
  providers: [PhoneLoginService]
})
export class ModalPage {
  message: string;
  public recaptchaVerifier: firebase.auth.RecaptchaVerifier;

  constructor(public navCtrl: NavController,
    public viewCtrl: ViewController,
    private _phoneLoginService: PhoneLoginService,
    public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalPage');
    this.message = this.navParams.get('message');
    this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');
  }
 
  signInPhone1(number: number) {
    this._phoneLoginService.signInPhone(number, this.recaptchaVerifier);
  }

  public closeModal() {
    this.viewCtrl.dismiss();
  }
}
