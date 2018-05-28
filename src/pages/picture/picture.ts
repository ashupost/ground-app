import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { AngularFireStorage } from 'angularfire2/storage';
import { Observable } from 'rxjs/Observable';
import { finalize } from 'rxjs/operators';
import { GroundFirebaseStoreService } from '../../app/sources/services/ground-firebasestore.service';
import { AngularFireAuth } from 'angularfire2/auth';
import { GroundStorageService } from '../../app/sources/services/ground-storage.service';
import { UserDetails } from '../../app/sources/model/userdetails';


@IonicPage()
@Component({
  selector: 'page-picture',
  templateUrl: 'picture.html',
})
export class PicturePage {

  uploadPercent: Observable<number>;
  downloadURL: Observable<string | null>;
  profileUrl: Observable<string | null>;
  meta: Observable<any>;

  public event = {
    month: '1990-02-19',
    timeStarts: '07:43',
    timeEnds: '1990-02-20'
  }
  
  
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public alertCtrl: AlertController,
    private _groundStorageService: GroundStorageService,
 
    private afAuth: AngularFireAuth,
    private _groundFirebaseStoreService: GroundFirebaseStoreService,
    private storage: AngularFireStorage) {
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PicturePage');
  }

  doPrompt() {
    let prompt = this.alertCtrl.create({
      title: 'Login',
      message: "Enter a name for this new album you're so keen on adding",
      inputs: [
        {
          name: 'title',
          placeholder: 'Title'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
            console.log('Saved clicked');
          }
        }
      ]
    });
    prompt.present();
  }
  
  uploadFile(event) {
    this._groundStorageService.getStorage('STORAGE:LOGIN:USERINFO').then((loginUserDetails) => {
    
    const file = event.target.files[0];
    const filePath = loginUserDetails.uid;
    const ref = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);
  
    //this.meta = ref.getMetadata();
    const userId = '1VSWOhNOMVYWFtilB3xBpipTZNh1';
    this.uploadPercent = task.percentageChanges();
    // get notified when the download URL is available
    task.snapshotChanges().pipe(finalize(() => {
        this.downloadURL = ref.getDownloadURL();
        this.downloadURL.subscribe((data)=>{
          this._groundFirebaseStoreService.updatePhotoURL(loginUserDetails.uid, data);
        });
      
    })).subscribe();
    this.meta = ref.getMetadata();
  });
  }

}
