import { Component, OnInit, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Nav, App } from 'ionic-angular';

import { GroundFirebaseStoreService } from '../../app/sources/services/ground-firebasestore.service';
import { UserDetails } from '../../app/sources/model/userdetails';
import { Observable } from 'rxjs/Observable';
import { MessagesPage } from '../messages/messages';
import { Storage } from '@ionic/storage';
import { GroundStorageService } from '../../app/sources/services/ground-storage.service';
import { AuthServiceStatusService } from '../../app/sources/status-service/auth-service';


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
  myData: UserDetails;
  

  constructor(
    private _app: App,
    public _navCtrl: NavController, 
    public _navParams: NavParams,
    private _storage: Storage,
    private _groundStorageService: GroundStorageService,
    public _authServiceStatusService: AuthServiceStatusService,
    private _groundFirebaseStoreService: GroundFirebaseStoreService
  ) {
    this._groundStorageService.getStorage('STORAGE:LOGIN:USERINFO').then((loginUserDetails: UserDetails) => {
      this.myData = loginUserDetails;
      this.myId = loginUserDetails.uid;
      this.items = this._groundFirebaseStoreService.getUsers();
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad1 Tab1Page');
  }

  goToMessagePage(toUserDetails: UserDetails) {
    this._storage.ready().then(() => {
      this._storage.get('STORAGE:LOGIN:USERINFO').then((loginUserDetails: UserDetails) => {
        let data = { user: loginUserDetails, toUserDetails: toUserDetails };
        this._app.getRootNav().push(MessagesPage, data);
      });
    });
  }
}
