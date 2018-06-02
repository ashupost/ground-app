import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { GroundFirebaseStoreService } from '../../app/sources/services/ground-firebasestore.service';

/**
 * Generated class for the DisplayUserPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-display-user',
  templateUrl: 'display-user.html',
})
export class DisplayUserPage {
  userUID: string;
  photos: any = [];


  constructor(public navCtrl: NavController, 
    public _navParams: NavParams,
    private afAuth: AngularFireAuth,
    private _groundFirebaseStoreService: GroundFirebaseStoreService
   
  ) {
    this.userUID = this._navParams.get('userUID'); // Other User

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DisplayUserPage');
    this._groundFirebaseStoreService.getPhotoUserData(this.userUID).subscribe(data => {
     this.photos = data;
    });

  }

}
