import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Events } from 'ionic-angular';
import { AlertController, Platform } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';
import { Storage } from '@ionic/storage';
import { UserDetails, UserStatus, AddressUser } from '../../app/sources/model/userdetails';
import { GoogleLoginService } from '../../app/sources/services/google-login.service';
import { FaceBookLoginService } from '../../app/sources/services/facebook-login.service';
import { StoreKey } from '../../app/sources/model/store-key.enum';
import { GroundFirebaseStoreService } from '../../app/sources/services/ground-firebasestore.service';
import { SaveUserGeolocationService } from '../../app/sources/services/save-user-geolocation.service';
import { GMapsWapperService } from '../../app/sources/google/google.map.wapper.service';
import { UtilService } from '../../app/sources/services/util.service';
import { GroundAuthService } from '../../app/sources/services/ground.auth.service';


@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  providers: [GoogleLoginService, FaceBookLoginService, UtilService, GroundAuthService]
})
export class LoginPage {

  user: Observable<firebase.User>;
  userInformation: UserDetails = new UserDetails();

  constructor(
    private __zone: NgZone,
    private __storage: Storage,
    private __navCtrl: NavController,
    private __afAuth: AngularFireAuth,
    private __alertCtrl: AlertController,
    private __modalCtrl: ModalController,
    private __utilService: UtilService,
    private __gas: GroundAuthService,
    private __faceBookLoginService: FaceBookLoginService,
    private __groundFirebaseStoreService: GroundFirebaseStoreService,
    private __saveUserGeolocationService: SaveUserGeolocationService,
    private __googleLoginService: GoogleLoginService
  ) {

    //this.__gas.currentUserId

    this.user = this.__afAuth.authState;
    this.__afAuth.authState.subscribe(res => {
      if (res && res.uid) {
        this.userInformation.uid = res.uid;
        this.userInformation.email = res.email;
        this.userInformation.photoURL = res.photoURL;
        this.userInformation.name = res.displayName;
        this.userInformation.status = UserStatus.SIGNOUT;
        this.userInformation.accountType = res.providerData[0].providerId;
        if (this.userInformation.accountType === 'phone') {
          this.userInformation.name = res.phoneNumber;
        }
        this.__groundFirebaseStoreService.addUsers(this.userInformation);
       //  this.doLogin();
      }
    });
  }


  public phonelogin() {
    const modalPage = this.__modalCtrl.create('ModalPage', { message: 'test' });
    modalPage.present();
  }
  ionViewDidLoad() {
  }
  doLogin() {
    this.__afAuth.authState.subscribe(res => {
      if (res && res.uid) {
        this.__saveUserGeolocationService.setGeoCoordinate(res.uid);
        this.__navCtrl.setRoot('MenuPage');
      }
    });
 }

  facebookLogin() {
    this.__faceBookLoginService.facebookLogin();
  }
  googlePlusLogin() {
    this.__googleLoginService.googlePlusLogin();
  }
  signOut() {
    this.__afAuth.auth.signOut();
  }

}
