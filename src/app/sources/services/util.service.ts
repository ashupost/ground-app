import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import { Platform } from 'ionic-angular';


@Injectable()
export class UtilService {
  constructor(private __platform: Platform) { }

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

  isCordova() {
    if (this.__platform.is('cordova')) return true;
    else false;
  }
}

