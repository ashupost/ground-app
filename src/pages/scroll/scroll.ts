import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UserDetails } from '../../app/sources/model/userdetails';
import { Observable } from 'rxjs/Observable';
import { MovieService } from '../../app/sources/scroll/movie.service';

/**
 * Generated class for the ScrollPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-scroll',
  templateUrl: 'scroll.html',
})
export class ScrollPage {
  items$: Observable<UserDetails[]>;

  constructor(public navCtrl: NavController, public navParams: NavParams,private movieService: MovieService) { }
  
  next(id: string) {
    this.items$ = this.movieService.getUsers(2, id);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ScrollPage');
    this.items$ = this.movieService.getUsers(2);
  }

}
