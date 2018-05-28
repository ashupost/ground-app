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
import { GMapsService } from '../../app/sources/google/gmap.service';


@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  providers: [GoogleLoginService, FaceBookLoginService, GMapsService]
})
export class LoginPage {

  user: Observable<firebase.User>;
  userInformation: UserDetails = new UserDetails();

  lat: any;



  getAddress() {
    this._gMapsService.geocodeAddress().subscribe((result: AddressUser) => {
      this.__zone.run(() => {
        console.log('dil',result);
        if(result){
          console.log('Available', result.country);
        }else{
          console.log('Not Available');
        }
      })
    },
      error => console.log(error),
      () => console.log('Geocoding completed!')
    );
  }

  constructor(
    private _storage: Storage,
    public navCtrl: NavController,
    private afAuth: AngularFireAuth,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private _gMapsService: GMapsService,
    private _faceBookLoginService: FaceBookLoginService,
    private _groundFirebaseStoreService: GroundFirebaseStoreService,
    private _saveUserGeolocationService: SaveUserGeolocationService,
    private _googleLoginService: GoogleLoginService,
    private __zone: NgZone
  ) {
    this.getAddress();
    //this._gMapsService.getLatLan().subscribe(value => {
    //    alert(JSON.stringify(value));
    //    console.log(value);
    //});
    this.user = this.afAuth.authState;
    this.afAuth.authState.subscribe(res => {
      if (res && res.uid) {
        // this.userInformation = this.convert(res);
        this.userInformation.uid = res.uid;
        this.userInformation.email = res.email;
        this.userInformation.photoURL = res.photoURL;
        this.userInformation.name = res.displayName;
        this.userInformation.status = UserStatus.SIGNOUT;
        this.userInformation.accountType = res.providerData[0].providerId;

        if (this.userInformation.accountType === 'phone') {
          this.userInformation.name = res.phoneNumber;
        }

        this._groundFirebaseStoreService.addUsers(this.userInformation);
        this._storage.ready().then(() => {
          this._storage.get('STORAGE:LOGIN:USERINFO').then((loginUserDetails: UserDetails) => {
            this._storage.set('STORAGE:LOGIN:USERINFO', this.userInformation);
          });
        });
        //  this.doLogin();
      }
    });
  }


  public phonelogin() {
    const data = { message: 'hello world' };
    const modalPage = this.modalCtrl.create('ModalPage', data);
    modalPage.present();
  }

  ionViewDidLoad() {
  }

  doLogin() {
    this._saveUserGeolocationService.setGeoCoordinate(this.userInformation.uid);
    this.navCtrl.setRoot('MenuPage');
  }

  facebookLogin() {
    this._faceBookLoginService.facebookLogin();
  }
  googlePlusLogin() {

    this._googleLoginService.googlePlusLogin();
  }
  signOut() {
    this.afAuth.auth.signOut();
  }

}
