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
      zoomControl: false, 
      mapTypeControl: false,
      streetViewControl: false, 
      fullscreenControl: false, 
      gestureHandling: 'none',
    };

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: this.map.getCenter()
    });
   
    let content = "<h4>Information!</h4>";         
   
    let infoWindow = new google.maps.InfoWindow({
      content: content
    });
   
    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(this.map, marker);
    });
    

  }

  dismissModal() { 
    this.navCtrl.pop();
  }
}
