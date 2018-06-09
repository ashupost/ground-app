import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UserDetails } from '../../app/sources/model/userdetails';
import { Observable } from 'rxjs/Observable';
import { MovieService } from '../../app/sources/scroll/movie.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import * as _ from 'lodash'

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
export class ScrollPage implements OnInit {
  items$: Observable<UserDetails[]>;
  movies = new BehaviorSubject([]);
  selector: string = ".main-panel";
  
  batch = 3         // size of each query
  lastKey = ''      // key to offset next query from
  finished = false  // boolean when end of database is reached

  constructor(public navCtrl: NavController, public navParams: NavParams,private movieService: MovieService) { }
  
  ngOnInit() {
    this.getMovies();
  }
  
  onScroll() {
    console.log('scrolled!!')
    this.getMovies()
  }
  onScrollDown() {
    console.log("scrolled down!!");
   // this.getMovies()
  }

  onScrollUp() {
    console.log("scrolled up!!");
   // this.getMovies()
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad ScrollPage');
   // this.items$= this.movieService.getUsers1();
   }

  private getMovies(key?) {
    if (this.finished) return

    this.movieService.getUsers(this.batch+1, this.lastKey)
        .do(movies => {
          
          console.log('movies', movies);
          console.log('_.last(movies)', _.last(movies));
          /// set the lastKey in preparation for next query
          this.lastKey = _.last(movies).uid;

          console.log('this.lastKey=>', this.lastKey);
          
          
         // alert( this.lastKey);
          const newMovies = _.slice(movies, 0, this.batch)

          console.log('newMovies=>', newMovies);

          /// Get current movies in BehaviorSubject
          const currentMovies = this.movies.getValue();
          console.log('currentMovies=>', currentMovies);

          console.log('_.last(newMovies)=>', _.last(newMovies));

          console.log('_.last(newMovies).uid=>', _.last(newMovies).uid);
          /// If data is identical, stop making queries
          if (this.lastKey == _.last(newMovies).uid) {
            this.finished = true
          }
          console.log('_.concat(currentMovies, newMovies) ', _.concat(currentMovies, newMovies) );
          /// Concatenate new movies to current movies
          this.movies.next( _.concat(currentMovies, newMovies) );

        })
        .take(1)
        .subscribe();
  }
}


