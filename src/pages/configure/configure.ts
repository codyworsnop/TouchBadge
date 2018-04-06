import { Component, NgZone } from '@angular/core';
import { NavController } from 'ionic-angular';
import { BLE } from '@ionic-native/ble';
import { ToastController } from 'ionic-angular';


@Component({
  selector: 'page-configure',
  templateUrl: 'configure.html'
})

export class ConfigurePage {
  
  statusMessage: string;

  constructor(
    private ngZone: NgZone) {
  }

  setStatus(message) {
    console.log(message);
    this.ngZone.run(() => {
      this.statusMessage = message;
    });
  }

}
