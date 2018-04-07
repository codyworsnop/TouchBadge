import { Component, NgZone } from '@angular/core';
import { NavController } from 'ionic-angular';
import { BLE } from '@ionic-native/ble';
import { ToastController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';

@Component({
  selector: 'page-configure',
  templateUrl: 'configure.html'
})

export class ConfigurePage {
  lat: string;
  long: string;
  statusMessage: string;

  constructor(
    private ngZone: NgZone,
    private geolocation: Geolocation) {
  }

  GetLocation() {
    this.geolocation.getCurrentPosition().then((resp) => {
      console.log("Lat: " + resp.coords.latitude + " Long: " + resp.coords.longitude);
      // resp.coords.latitude
      // resp.coords.longitude
     }).catch((error) => {
       console.log('Error getting location', error);
     });
  }

  setStatus(message) {
    console.log(message);
    this.ngZone.run(() => {
      this.statusMessage = message;
    });
  }

}
