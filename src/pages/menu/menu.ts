
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, Nav } from 'ionic-angular';
import { AuthServiceStatusService } from '../../app/sources/status-service/auth-service';
import { GroundFirebaseStoreService } from '../../app/sources/services/ground-firebasestore.service';
import { AngularFireAuth } from 'angularfire2/auth';
import { PageInterface, UserDetails } from '../../app/sources/model/userdetails';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';


@IonicPage()
@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
  providers: [AuthServiceStatusService]
})
export class MenuPage {
  // Basic root for our content view
  rootPage = 'TabsPage';

  // Reference to the app's root nav
  @ViewChild(Nav) nav: Nav;
  user: Observable<UserDetails>;

  pages: PageInterface[] = [
    { title: 'Global User', pageName: 'TabsPage', tabComponent: 'Tab1Page', index: 0, icon: 'people' },
    { title: 'Online User', pageName: 'TabsPage', tabComponent: 'Tab3Page', index: 1, icon: 'contact' },

    { title: 'Users', pageName: 'UsersPage', icon: 'man' },
    { title: 'Profile', pageName: 'SettingsPage', icon: 'settings' },
    { title: 'AboutPage', pageName: 'AboutPage', icon: 'image' },
    { title: 'PersonalPage', pageName: 'PersonalPage', icon: 'image' }
  ];

  ionViewDidLoad() {
    this.user = this.afAuth.authState.switchMap((firebaseUser: firebase.User) => {
      return this._groundFirebaseStoreService.getUserByid(firebaseUser.uid);
    })
  }


  constructor(public navCtrl: NavController,
    public __authService: AuthServiceStatusService,
    private afAuth: AngularFireAuth,
    private _groundFirebaseStoreService: GroundFirebaseStoreService) {

  }

  logout() {
    this.__authService.signOut();
    this.navCtrl.setRoot('LoginPage');
  }

  openPage(page: PageInterface) {
    let params = {};

    // The index is equal to the order of our tabs inside tabs.ts
    if (page.index) {
      params = { tabIndex: page.index };
    }

    // The active child nav is our Tabs Navigation
    if (this.nav.getActiveChildNavs()[0] && page.index != undefined) {
      this.nav.getActiveChildNavs()[0].select(page.index);

    } else {
      // Tabs are not active, so reset the root page 
      // In this case: moving to or from SpecialPage
      this.nav.setRoot(page.pageName, params);
    }
  }

  isActive(page: PageInterface) {
    // Again the Tabs Navigation
    let childNav = this.nav.getActiveChildNavs()[0];

    if (childNav) {
      if (childNav.getSelected() && childNav.getSelected().root === page.tabComponent) {
        return 'primary';
      }
      return;
    }

    // Fallback needed when there is no active childnav (tabs not active)
    if (this.nav.getActive() && this.nav.getActive().name === page.pageName) {
      return 'primary';
    }
    return;
  }

}