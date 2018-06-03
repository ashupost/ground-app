import { Component, OnInit, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Nav, App } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { Storage } from '@ionic/storage';
import { GroundFirebaseStoreService } from '../../app/sources/services/ground-firebasestore.service';
import { UserDetails } from '../../app/sources/model/userdetails';
import { MessagesPage } from '../messages/messages';
import { GroundStorageService } from '../../app/sources/services/ground-storage.service';
import { AuthServiceStatusService } from '../../app/sources/status-service/auth-service';
import { GroundAuthService } from '../../app/sources/services/ground.auth.service';
import { AngularFireAuth } from 'angularfire2/auth';

@IonicPage()
@Component({
  selector: 'page-tab1',
  templateUrl: 'tab1.html'
})
export class Tab1Page implements OnInit {
  ngOnInit(): void {
  }

  @ViewChild(Nav) nav: Nav;
  items: Observable<UserDetails[]>;
  myId: string = '';
  myData: Observable<UserDetails>;

  constructor(private _app: App,
    public __navCtrl: NavController,
    public __navParams: NavParams,
    private __gas: GroundAuthService,
    private __afAuth: AngularFireAuth,
    private __groundStorageService: GroundStorageService,
    private __groundFirebaseStoreService: GroundFirebaseStoreService) {
    this.__afAuth.authState.subscribe(res => {
      if (res && res.uid) {
        this.myId = res.uid;
      }
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad1 Tab1Page');
    this.items = this.__groundFirebaseStoreService.getUsers();
  }

  goToMessagePage(toUserDetails: UserDetails) {
    let data = { user: this.__gas.currentUser, toUserDetails: toUserDetails };
    this._app.getRootNav().push(MessagesPage, data);
  }
}
