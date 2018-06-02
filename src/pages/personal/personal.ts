import { Component, OnInit, OnDestroy } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { MouseEvent } from '@agm/core';
import { LocationTrackerService } from '../../app/sources/services/location-tracker.service';


@IonicPage()
@Component({
  selector: 'page-personal',
  templateUrl: 'personal.html'
})
export class PersonalPage implements OnInit, OnDestroy {
  zoom: number = 8;
  lat: number;
  lng: number;
  ngOnInit(): void {
    console.log('ngOnInit');
    this.getUserLocation();

  }
  private getUserLocation() {

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
      });
    }
  }


  ngOnDestroy() {
  }

  constructor(private locationTrackerService: LocationTrackerService) {
    // this.getUserLocation();
    this.locationTrackerService.startTracking();
    this.lat = this.locationTrackerService.lat;
    this.lng = this.locationTrackerService.lng;

  }


  clickedMarker(label: string, index: number) {
    console.log(`clicked the marker: ${label || index}`)
  }

  mapClicked($event: MouseEvent) {
    this.markers.push({
      lat: $event.coords.lat,
      lng: $event.coords.lng,
      draggable: true
    });
  }

  markers: marker[] = [
    {
      lat: 51.673858,
      lng: 7.815982,
      label: 'A',
      draggable: true
    },
    {
      lat: 51.373858,
      lng: 7.215982,
      label: 'B',
      draggable: false
    },
    {
      lat: 51.723858,
      lng: 7.895982,
      label: 'C',
      draggable: true
    }
  ];

  ionViewDidLoad() {
    console.log('ionViewDidLoad PersonalPage');
  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter');
  }
  ionViewDidEnter() {
    console.log('ionViewDidEnter');
  }

  ionViewWillLeave() {
    console.log('ionViewWillLeave');
  }

  ionViewDidLeave() {
    console.log('ionViewDidLeave');
  }

  ionViewWillUnload() {
    console.log('ionViewWillUnload');
  }
}


// just an interface for type safety.
interface marker {
  lat: number;
  lng: number;
  label?: string;
  draggable: boolean;
}
