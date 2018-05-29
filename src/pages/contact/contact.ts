import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {

  isUserLoggedIn: any =false;
  userInfo: any = {};
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams) {

  }
  login(){
    (<any>window).AccountKitPlugin.loginWithPhoneNumber({
      useAccessToken: true,
      defaultCountryCode: "IN",
      facebookNotificationEnabled: true
    }, data => {
      this.isUserLoggedIn = true;
      (<any>window).AccountKitPlugin.getAccount(info => {
        this.userInfo = info;
       // alert('info'+ info);
      }, err => { alert('error='+err) }
      );
    },
      err => alert('error'+err)
    );
  }

  logout() {
    this.isUserLoggedIn =false;
    (<any>window).AccountKitPlugin.logout();
  }
}
