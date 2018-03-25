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
    let latLng = { lat: -34.9290, lng: 138.6010 };
    let mapOptions = {
      center: latLng, 
      zoom: 15, 
      mapTypeId: google.maps.MapTypeId.ROADMAP,
    };

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
  }

  dismissModal() { 
    this.navCtrl.pop();
  }
}
