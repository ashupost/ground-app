import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { AngularFireDatabaseModule, AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { Facebook } from '@ionic-native/facebook';
import { GooglePlus } from '@ionic-native/google-plus';
import { Geolocation } from '@ionic-native/geolocation';
import { IonicStorageModule } from '@ionic/storage';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AngularFireModule } from 'angularfire2';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { AgmCoreModule } from '@agm/core';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';

import { GeolocationService } from './sources/services/geolocation.service';
import { GroundFirebaseStoreService } from './sources/services/ground-firebasestore.service';
import { GroundStorageService } from './sources/services/ground-storage.service';
import { LocationTrackerService } from './sources/services/location-tracker.service';
import { PhoneLoginService } from './sources/services/phone-login.service';
import { SaveUserGeolocationService } from './sources/services/save-user-geolocation.service';
import { DistanceService } from './sources/services/distance.service';
import { AuthServiceStatusService } from './sources/status-service/auth-service';
import { GroundDatabaseStatusService } from './sources/status-service/ground-database-status.service';
import { NotificationService } from './sources/notification.service';
import { UtilService } from './sources/services/util.service';
import { GoogleLoginService } from './sources/services/google-login.service';
import { FaceBookLoginService } from './sources/services/facebook-login.service';
import { MessagesPageModule } from '../pages/messages/messages.module';
import { PipesModule } from '../pipes/pipes.module';
import { GMapsService } from './sources/google/gmap.service';
import { DirectivesModule } from '../directives/directives.module';
import { CameraService } from './sources/camera/camera.service';
import { Camera } from '@ionic-native/camera';
import { DisplayUserPageModule } from '../pages/display-user/display-user.module';
import { GroundAuthService } from './sources/services/ground.auth.service';
import { CaptureImagePageModule } from '../pages/capture-image/capture-image.module';
import { ImageCropperModule } from "ngx-img-cropper";
import { MovieService } from './sources/scroll/movie.service';

export const firebaseConfig = {
  apiKey: "AIzaSyCxjWoBYpJNCtd1wGvNk3n8nEgR4ryvqA8",
  authDomain: "ground-firebase.firebaseapp.com",
  databaseURL: "https://ground-firebase.firebaseio.com",
  projectId: "ground-firebase",
  storageBucket: "ground-firebase.appspot.com",
  messagingSenderId: "329915457638"
};

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    PipesModule,
    DirectivesModule,
    MessagesPageModule,
    CaptureImagePageModule,
    DisplayUserPageModule,
    BrowserModule,
    AgmCoreModule.forRoot({ apiKey: 'AIzaSyCxjWoBYpJNCtd1wGvNk3n8nEgR4ryvqA8' }),
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFirestoreModule,
    //   IonicStorageModule.forRoot({name: '__mydb1', driverOrder: ['sqlite', 'websql']}),
    IonicStorageModule.forRoot(),
    AngularFireStorageModule,
    ImageCropperModule

  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AngularFireDatabase,
    GooglePlus,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    Facebook,
    GoogleLoginService,
    FaceBookLoginService,
    PhoneLoginService,
    Geolocation,
    BackgroundGeolocation,
    GeolocationService,
    GroundFirebaseStoreService,
    GroundStorageService,
    LocationTrackerService,
    SaveUserGeolocationService,
    DistanceService,
    AuthServiceStatusService,
    GroundDatabaseStatusService,
    NotificationService,
    UtilService,
    GMapsService,
    CameraService,
    Camera,
    GroundAuthService,
    MovieService
  ]
})
export class AppModule { }
