import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HTTPService, Config } from './http.service';
import { Observable } from 'rxjs';

@IonicPage()
@Component({
  selector: 'page-http',
  templateUrl: 'http.html',
  providers: [HTTPService]
})
export class HttpPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private __httpService: HTTPService
  ) {
  }

  items: Observable<Config[]>;
  error: any;
  ionViewDidLoad() {
    console.log('ionViewDidLoad HttpPage');
    this.items = this.__httpService.getUserJava();
    
  }
}
