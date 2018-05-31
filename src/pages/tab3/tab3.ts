import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { UserDetails } from '../../app/sources/model/userdetails';
import { MessagesPage } from '../messages/messages';
import { Storage } from '@ionic/storage';

import { GroundFirebaseStoreService } from '../../app/sources/services/ground-firebasestore.service';
import { AuthServiceStatusService } from '../../app/sources/status-service/auth-service';
import { GroundStorageService } from '../../app/sources/services/ground-storage.service';

/**
 * Generated class for the Tab3Page page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-tab3',
  templateUrl: 'tab3.html',
})
export class Tab3Page {
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
      this.items = this._groundFirebaseStoreService.getUsersOnline();
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
