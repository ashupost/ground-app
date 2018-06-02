import { Component, OnInit, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Nav, App } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { Storage } from '@ionic/storage';
import { GroundFirebaseStoreService } from '../../app/sources/services/ground-firebasestore.service';
import { UserDetails } from '../../app/sources/model/userdetails';
import { MessagesPage } from '../messages/messages';
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

  constructor(private _app: App,
    public __navCtrl: NavController,
    public __navParams: NavParams,
    private __storage: Storage,
    private __groundStorageService: GroundStorageService,
    public __authServiceStatusService: AuthServiceStatusService,
    private __groundFirebaseStoreService: GroundFirebaseStoreService) { }

  ionViewDidLoad() {
    console.log('ionViewDidLoad1 Tab1Page');
    this.__storage.ready().then(() => {
      this.__groundStorageService.getStorage('STORAGE:LOGIN:USERINFO').then((loginUserDetails: UserDetails) => {
        this.myData = loginUserDetails;
        this.myId = loginUserDetails.uid;
        this.items = this.__groundFirebaseStoreService.getUsers();
      });
    });
  }

  goToMessagePage(toUserDetails: UserDetails) {
    this.__storage.ready().then(() => {
      this.__storage.get('STORAGE:LOGIN:USERINFO').then((loginUserDetails: UserDetails) => {
        let data = { user: loginUserDetails, toUserDetails: toUserDetails };
        this._app.getRootNav().push(MessagesPage, data);
      });
    });
  }
}
