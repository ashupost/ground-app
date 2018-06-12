import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase';
import { UserDetails } from '../model/userdetails';
import { GroundFirebaseStoreService } from './ground-firebasestore.service';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs';


@Injectable()
export class GroundAuthService {

  authState: any = null;

  constructor(private afAuth: AngularFireAuth, private __gfss: GroundFirebaseStoreService) {
    this.afAuth.authState.subscribe((auth) => {
      this.authState = auth
    });
  }

 async isLoogedIn(): Promise<any> {
    return await new Promise((resolve, reject) => {
      this.afAuth.authState.subscribe((auth) => {
        if (auth && auth.uid) resolve(auth.uid);
        else reject();
      });
    });
  }


  // Returns true if user is logged in
  get authenticated(): boolean {
    return this.authState !== null;
  }

  // Returns current user data
  get currentUser(): any {
    return this.authenticated ? this.authState : null;
  }

  // Returns
  get currentUserObservable(): any {
    return this.afAuth.authState
  }

  // Returns current user UID
  get currentUserId(): string {
    return this.authenticated ? this.authState.uid : null;
  }

  // Anonymous User
  get currentUserAnonymous(): boolean {
    return this.authenticated ? this.authState.isAnonymous : false
  }

  // Returns current user display name or Guest
  get currentUserDisplayName(): string {
    if (!this.authState) { return 'Guest' }
    else if (this.currentUserAnonymous) { return 'Anonymous' }
    else { return this.authState['displayName'] || 'User without a Name' }
  }

  signOut(): void {
    this.afAuth.auth.signOut();
  }

  get currentUserInfo(): Observable<UserDetails> {
    if (!this.currentUserId) return null;
    return this.__gfss.getUserByid(this.currentUserId);
  }

}