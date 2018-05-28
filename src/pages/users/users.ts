import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { GroundFirebaseDatabaseService } from '../../app/sources/services/ground-firebase-database.service';
import { AngularFirestore } from 'angularfire2/firestore';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/combineLatest';
import firebase from 'firebase';
import 'firebase/firestore';

export interface Item {
  text: string;
  color: string;
  size: string;

}

@IonicPage()
@Component({
  selector: 'page-users',
  templateUrl: 'users.html',
  providers: [GroundFirebaseDatabaseService]
})
export class UsersPage {
  
  items$: Observable<Item[]>;
  sizeFilter$: BehaviorSubject<string|null>;
  colorFilter$: BehaviorSubject<string|null>;
  
  constructor(private afs: AngularFirestore) {

    this.sizeFilter$ = new BehaviorSubject(null);
    this.colorFilter$ = new BehaviorSubject(null);

    this.items$ = Observable.combineLatest(
      this.sizeFilter$,
      this.colorFilter$
    ).switchMap(([size, color]) => 
      afs.collection<Item>('items', ref => {
        let query : firebase.firestore.Query = ref;
        if (size) { query = query.where('size', '==', size) };
        if (color) { query = query.where('color', '==', color) };
        return query;
      }).valueChanges()
    );
   this.addTodo();
  }
  filterBySize(size: string|null) {
    this.sizeFilter$.next(size); 
  }
  filterByColor(color: string|null) {
    this.colorFilter$.next(color); 
  }
  ;
  addTodo() {
    for(let i = 1; i<= 2; i++){
    this.afs.collection<Item>('items')
    .add({ text: 'mohan'+i, color: 'green', size: 'large'});
    }
  }
}
