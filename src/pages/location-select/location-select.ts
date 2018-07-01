import { IonicPage, NavParams } from 'ionic-angular';

import { NavController, Platform, ViewController } from 'ionic-angular';
import { Component, ElementRef, ViewChild, NgZone } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';
import { GoogleMaps } from '../../providers/google-maps/google-maps';

@IonicPage()
@Component({
    selector: 'page-location-select',
    templateUrl: 'location-select.html',
})

export class LocationSelectPage {
    // https://www.joshmorony.com/location-select-page-with-google-maps-and-ionic/
    @ViewChild('map') mapElement: ElementRef;
    @ViewChild('pleaseConnect') pleaseConnect: ElementRef;

    latitude: number;
    longitude: number;
    autocompleteService: any;
    placesService: any;
    query: string = '';
    places: any = [];
    searchDisabled: boolean;
    saveDisabled: boolean;
    location: any;

    constructor(public navCtrl: NavController,
        public zone: NgZone,
        public maps: GoogleMaps,
        public platform: Platform,
        public geolocation: Geolocation,
        public viewCtrl: ViewController) {
        this.searchDisabled = true;
        this.saveDisabled = true;
    }

    ionViewDidLoad(): void {
        let mapLoaded = this.maps.init(this.mapElement.nativeElement, this.pleaseConnect.nativeElement).then(() => {
            this.autocompleteService = new google.maps.places.AutocompleteService();
            this.placesService = new google.maps.places.PlacesService(this.maps.map);
            this.searchDisabled = false;
        });
    }

    selectPlace(place) {
        this.places = [];
        let location = {
            lat: null,
            lng: null,
            name: place.name
        };

        this.placesService.getDetails({ placeId: place.place_id }, (details) => {
            this.zone.run(() => {
                location.name = details.name;
                location.lat = details.geometry.location.lat();
                location.lng = details.geometry.location.lng();
                this.saveDisabled = false;
                this.location = location;

                var contentString = '<strong>information</strong>';
                var infowindow = new google.maps.InfoWindow({
                    content: contentString
                });
                
                this.maps.map.setZoom(8);
                var myLatlng = { lat: location.lat, lng: location.lng };

                var marker = new google.maps.Marker({
                    position: myLatlng,
                    map: this.maps.map,
                    title: 'Click to zoom',
                    animation: google.maps.Animation.DROP,
                    label: 'M',
                    opacity: 1.0
                });

                this.maps.map.setCenter(marker.getPosition());

                marker.addListener('click', function () {
                    infowindow.open(this.maps, marker);
                });
            });
        });
    }

    searchPlace() {
        this.saveDisabled = true;
        if (this.query.length > 0 && !this.searchDisabled) {
            let config = {
                types: ['geocode'],
                input: this.query
            }
            this.autocompleteService.getPlacePredictions(config, (predictions, status) => {
                if (status == google.maps.places.PlacesServiceStatus.OK && predictions) {
                    this.places = [];
                    predictions.forEach((prediction) => {
                        this.places.push(prediction);
                    });
                }
            });
        } else {
            this.places = [];
        }
    }
    save() {
        this.viewCtrl.dismiss(this.location);
    }
    close() {
        this.viewCtrl.dismiss();
    }

    launchLocationPage() {
        // let modal = this.modalCtrl.create(LocationSelect);
        // modal.onDidDismiss((location) => {
        //     console.log(location);
        //  });
        // modal.present();   
    }





}