import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular'
import { GeoCordinate } from '../../app/sources/services/geolocation.service';
import { GroundFirebaseDatabaseService } from '../../app/sources/services/ground-firebase-database.service';
import { Observable } from 'rxjs/Observable';


@IonicPage()
@Component({
  selector: 'page-tab2',
  templateUrl: 'tab2.html',
  providers: [GroundFirebaseDatabaseService]
})
export class Tab2Page {
    _geoCordinate: GeoCordinate = new GeoCordinate();
     dbData: Observable<any[]>;
     shoppingItem: Observable<any[]>;
     newItem='';

  constructor(public _navCtrl: NavController,
    public _navParams: NavParams,
    private _databaseService: GroundFirebaseDatabaseService
  ) {
      this.shoppingItem = this._databaseService.getUsers();
     // console.log(this.shoppingItem);
  }
  ionViewDidLoad() {
  //this._geoCordinate = this._geolocationService.getGeolocationCoordinate();
  //this.dbData= this._databaseService.getUsers();

  }
  addItem(){
      this._databaseService.addUser(this.newItem);
      this.newItem='';
  }

  removeItem(key: any){
    this._databaseService.removeUser(key);
  }
}
