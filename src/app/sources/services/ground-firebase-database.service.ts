import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { UserDetails } from '../model/userdetails';

@Injectable()
export class GroundFirebaseDatabaseService {
    constructor(private _angularFireDatabase: AngularFireDatabase) { }

    getUsers() {
        return this._angularFireDatabase.list('/book/')
            .snapshotChanges().map(actions => {
                return actions.map(action => ({
                    key: action.key, value: action.payload.val()
                }));
            });
    }
    addUser(data) {
        let user = new UserDetails();
        user.email = 'ooooooooo';
        user.name = data;
        user.gender = 'M';
        this._angularFireDatabase.list('/book/').push(user);
    }
    addLoginUser(data: UserDetails) {
        this._angularFireDatabase.list('/users/').push(data);
    }
    val: AngularFireList<{}>;
    getLoginUsers() {
        this.val = this._angularFireDatabase.list('/users/');
        return this.val;
    }
    getUsersByKey(id: string) {
        return this._angularFireDatabase.list('/book/',
            ref => ref.equalTo(id));
    }
    removeUser(id) {
        this._angularFireDatabase.list('/book/').remove(id);
    }
}