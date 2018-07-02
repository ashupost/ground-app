import { Injectable } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';
import { Connectivity } from '../connectivity-service/connectivity-service';
import { MapOptions } from '@agm/core/services/google-maps-types';

@Injectable()
export class GoogleMaps {

  mapElement: any;
  pleaseConnect: any;
  map: any;
  mapInitialised: boolean = false;
  mapLoaded: any;
  mapLoadedObserver: any;
  currentMarker: any;
  //apiKey: string = "AIzaSyCxjWoBYpJNCtd1wGvNk3n8nEgR4ryvqA8"; // Actual
  // apiKey: string = "AIzaSyDanv8HnOiFtaLoQ7tNzc5v82Kuxm2SEoU"; // Dummy
  apiKey: string = "AIzaSyCrpUPhpbPzRI4hYC7xE02WKsrxQv0HClI"; // Dummy




  constructor(public connectivityService: Connectivity, public geolocation: Geolocation) {
  }

  async init(mapElement: any, pleaseConnect: any): Promise<any> {
    this.mapElement = mapElement;
    this.pleaseConnect = pleaseConnect;
    return await this.loadGoogleMaps();
  }

  async loadGoogleMaps(): Promise<any> {
    return await new Promise((resolve) => {
      if (typeof google == "undefined" || typeof google.maps == "undefined") {
        console.log("Google maps JavaScript needs to be loaded.");
        this.disableMap();
        if (this.connectivityService.isOnline()) {
          window['mapInit'] = () => {
            this.initMap().then(() => {
              resolve(true);
            });
            this.enableMap();
          }
          let script = document.createElement("script");
          script.id = "googleMaps";
          if (this.apiKey) {
             script.src = 'http://maps.google.com/maps/api/js?key=' + this.apiKey + '&callback=mapInit&libraries=places';
           // script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCrpUPhpbPzRI4hYC7xE02WKsrxQv0HClI&libraries=places&channel=monorail-prod&callback=mapInit';
          } else {
            script.src = 'http://maps.google.com/maps/api/js?callback=mapInit';
          }
          document.body.appendChild(script);
        }
      } else {
        if (this.connectivityService.isOnline()) {
          this.initMap();
          this.enableMap();
        }
        else {
          this.disableMap();
        }

        resolve(true);

      }

      this.addConnectivityListeners();

    });

  }

  initMap(): Promise<any> {

    this.mapInitialised = true;

    return new Promise((resolve) => {

      this.geolocation.getCurrentPosition().then((position) => {

        let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

        let mapOptions = {
          center: latLng,
          zoom: 15,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          zoomControlOptions: {
            style: google.maps.ZoomControlStyle.LARGE,
            position: google.maps.ControlPosition.RIGHT_CENTER
        },
        panControlOptions: {
          position: google.maps.ControlPosition.LEFT_CENTER
      },
      panControl: true,
      mapTypeControl: false

        }

        this.map = new google.maps.Map(this.mapElement, mapOptions);

       
        var contentString = '<strong>Your Current Location</strong>';
        var infowindow = new google.maps.InfoWindow({
          content: contentString
        });


        var marker = new google.maps.Marker({
          position: latLng,
          map: this.map,
          title: 'Current Location',
          animation: google.maps.Animation.DROP,
          label: 'C',
          opacity: 1.0
        });





        var Item_1 = new google.maps.LatLng(52.0983128, 5.1172776);

        
        var marker1 = new google.maps.Marker({
            position: Item_1,
            map: this.map
        });
    
      
    
        var bounds = new google.maps.LatLngBounds();
        bounds.extend(latLng);
        bounds.extend(Item_1);
        this.map.fitBounds(bounds);



        marker.addListener('click', function () {
          infowindow.open(this.map, marker);
        });

        resolve(true);

      });

    });

  }

  disableMap(): void {

    if (this.pleaseConnect) {
      this.pleaseConnect.style.display = "block";
    }

  }

  enableMap(): void {
    if (this.pleaseConnect) {
      this.pleaseConnect.style.display = "none";
    }
  }

  addConnectivityListeners(): void {
    this.connectivityService.watchOnline().subscribe(() => {
      setTimeout(() => {
        if (typeof google == "undefined" || typeof google.maps == "undefined") {
          this.loadGoogleMaps();
        }
        else {
          if (!this.mapInitialised) {
            this.initMap();
          }
          this.enableMap();
        }
      }, 2000);
    });

    this.connectivityService.watchOffline().subscribe(() => {
      this.disableMap();
    });
  }

}