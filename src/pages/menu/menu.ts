
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, Nav } from 'ionic-angular';
 
export interface PageInterface {
  title: string;
  pageName: string;
  tabComponent?: any;
  index?: number;
  icon: string;
}
 
@IonicPage()
@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})
export class MenuPage {
  // Basic root for our content view
  rootPage = 'TabsPage';
 
  // Reference to the app's root nav
  @ViewChild(Nav) nav: Nav;
 
  pages: PageInterface[] = [
    { title: 'Global User', pageName: 'TabsPage', tabComponent: 'Tab1Page', index: 0, icon: 'people' },
    { title: 'Tab 2', pageName: 'TabsPage', tabComponent: 'Tab2Page', index: 1, icon: 'chatbubbles' },
    { title: 'Online User', pageName: 'TabsPage', tabComponent: 'Tab3Page', index: 2, icon: 'contact' },
  
    { title: 'Special', pageName: 'SpecialPage', icon: 'shuffle' },
    { title: 'ContactPage', pageName: 'ContactPage', icon: 'image' },
    { title: 'Users', pageName: 'UsersPage', icon: 'man' },
    { title: 'PicturePage', pageName: 'PicturePage', icon: 'settings' },
    { title: 'AboutPage', pageName: 'AboutPage', icon: 'image' },
    { title: 'PersonalPage', pageName: 'PersonalPage', icon: 'image' }
   
   
  ];
  
  constructor(public navCtrl: NavController) { 
    
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