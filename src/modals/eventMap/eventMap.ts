import { Component, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';

declare var google; 

@Component({
  selector: 'modal-eventMap',
  templateUrl: 'eventMap.html'
})

export class eventMap {

  @ViewChild('map') mapElement;
  map: any;

  constructor(public navCtrl: NavController) {

  }

  ionViewDidLoad() { 
    this.InitMap();
  }

  InitMap() {
    let latLng = { lat: 39.485574, lng:-119.791234};
    let mapOptions = {
      center: latLng, 
      zoom: 17, 
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      zoomControl: false, 
      mapTypeControl: false,
      streetViewControl: false, 
      fullscreenControl: false, 
      minZoom: 15,
      maxZoom: 19,
      draggable: false,
    };

    var swLatLng = { lat: 39.485574, lng:-119.791234 };
    var neLatLng = { lat: 39.485574, lng:-119.791234 };
    var bounds = new google.maps.LatLngBounds(swLatLng, neLatLng);

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);    

  }

  dismissModal() { 
    this.navCtrl.pop();
  }
}
