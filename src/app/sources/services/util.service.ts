import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import { Platform } from 'ionic-angular';


@Injectable()
export class UtilService {
 // public isCordova: boolean;
  constructor(private __platform: Platform) { 

   // this.__platform.ready().then(() => {
    //  if (this.__platform.is('cordova')) this.isCordova= true;
    //  else this.isCordova= false;
    //  });

  }

  firebaseConneted() {
    var connectedRef = firebase.database().ref(".info/connected");
    connectedRef.on("value", (snap) => {
      if (snap.val() === true) {
        console.log("connected");
      } else {
        console.log("not connected");
      }
    });
  }

  getCurrentUser(): firebase.User {
    return firebase.auth().currentUser
  }

 
}

