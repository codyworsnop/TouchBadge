import { Component, NgZone } from '@angular/core';
import { NavController } from 'ionic-angular';
import { BLE } from '@ionic-native/ble';
import { ToastController } from 'ionic-angular';

@Component({
  selector: 'page-configure',
  templateUrl: 'configure.html'
})

export class ConfigurePage {

  devices: any[] = [];
  statusMessage: string;

  constructor(public navCtrl: NavController, 
    private toastCtrl: ToastController,
    private ble: BLE,
    private ngZone: NgZone) {

  }

  scan() {
    this.setStatus('Scanning for Bluetooth LE Devices');
    this.devices = [];  // clear list


    this.ble.startScanWithOptions([], { reportDuplicates: false }).subscribe(
      device => this.onDeviceDiscovered(device), 
      error => this.scanError(error)
    );

    setTimeout(this.ble.stopScan, 5000);
    setTimeout(this.setStatus.bind(this), 5000, 'Scan complete');
  }

  onDeviceDiscovered(device) {
    console.log('Discovered ' + JSON.stringify(device, null, 2));
    this.ngZone.run(() => {

      if (device.name != null)
      {
        this.devices.push(device);
      }

    });
  }

  // If location permission is denied, you'll end up here
  scanError(error) {
    this.setStatus('Error ' + error);
    let toast = this.toastCtrl.create({
      message: 'Error scanning for Bluetooth low energy devices',
      position: 'middle',
      duration: 5000
    });
    toast.present();
  }

  setStatus(message) {
    console.log(message);
    this.ngZone.run(() => {
      this.statusMessage = message;
    });
  }

}
