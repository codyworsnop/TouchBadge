import { Component, NgZone } from '@angular/core';
import { NavController } from 'ionic-angular';
import { BLE } from '@ionic-native/ble';
import { ToastController } from 'ionic-angular';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'page-configure',
  templateUrl: 'configure.html'
})

export class ConfigurePage {

  scanSubscription: Subscription;
  devices: any[] = [];
  devicesMap: any = {};
  statusMessage: string;
  input: string;
  connectedDevice: any;

  constructor(public navCtrl: NavController,
    private toastCtrl: ToastController,
    private ble: BLE,
    private ngZone: NgZone) {

  }

  scan() {
    this.setStatus('Scanning for Bluetooth LE Devices');
    this.devices = [];  // clear list
    this.devicesMap = {};

    this.scanSubscription = this.ble.startScan([]).subscribe(
      device => this.onDeviceDiscovered(device),
      error => this.scanError(error)
    );

    setTimeout(() => {
      this.scanSubscription.unsubscribe();
      this.ble.stopScan;
      this.setStatus("Scan Complete");
    }, 5000);
  }

  connect(device: any) {

    this.ble.connect(device.id).subscribe(
      success => {
        this.setStatus("Connected to device " + device.id);

        this.connectedDevice = device;
      },
      error => {
        this.setStatus("Error connecting to device " + device.id);
      }
    )
  }

  onDeviceDiscovered(device) {
    console.log('Discovered ' + JSON.stringify(device, null, 2));
    this.ngZone.run(() => {

      if (device.advertising.kCBAdvDataLocalName == "TouchBadge" && this.devicesMap[device.id] == null) {
        this.devicesMap[device.id] = device;
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

  send() {

    if (this.input != undefined) {
      // send 1 byte to switch a light on
      var data = new Uint8Array(1);
      data[0] = 1;
      this.ble.write(this.connectedDevice.id, "FF10", "FF11", )
      this.ble.write(this.connectedDevice.id, "FF10", "FF11", data.buffer, success, failure);
    }
  }

}
