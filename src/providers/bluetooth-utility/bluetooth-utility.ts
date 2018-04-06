import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { BLE } from '@ionic-native/ble';
import { Subscription } from 'rxjs/Subscription';

/*
  Generated class for the BluetoothUtilityProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class BluetoothUtilityProvider {

  scanSubscription: Subscription;
  devices: any[] = [];
  devicesMap: any = {};
  statusMessage: string;
  input: string;
  connectedDevice: any;

  constructor(private toastCtrl: ToastController,
    private ble: BLE,
    private ngZone: NgZone) {
  }

  scan(): Promise<any> {

    return new Promise((resolve, reject) => {

      //this.setStatus('Scanning for Bluetooth LE Devices');

      this.devices = [];  // clear list
      this.devicesMap = {};

      this.scanSubscription = this.ble.startScan([]).subscribe(
        device => this.onDeviceDiscovered(device),
        error => this.scanError(error)
      );

      setTimeout(() => {
        this.scanSubscription.unsubscribe();
        this.ble.stopScan;

        //   this.setStatus("Scan Complete");

        resolve(this.devices);

      }, 5000);
    });
  }

  connect(device: any) {

    this.ble.connect(device.id).subscribe(
      success => {
        //  this.setStatus("Connected to device " + device.id);

        this.connectedDevice = device;
      },
      error => {
        // this.setStatus("Error connecting to device " + device.id);
      }
    )
  }

  onDeviceDiscovered(device) {
    console.log('Discovered ' + JSON.stringify(device, null, 2));
    this.ngZone.run(() => {

      // if (device.advertising.kCBAdvDataLocalName == "TouchBadge" && this.devicesMap[device.id] == null) {
      this.devicesMap[device.id] = device;
      this.devices.push(device);
      // }
    });
  }

  // If location permission is denied, you'll end up here
  scanError(error) {
    console.log("error bluetooth: " + error);
  }

  send() {

    if (this.input != undefined) {
      // send 1 byte to switch a light on
      // var data = new Uint8Array(1);
      //  data[0] = 1;
      // this.ble.write(this.connectedDevice.id, "FF10", "FF11", )
      //  this.ble.write(this.connectedDevice.id, "FF10", "FF11", data.buffer, success, failure);
    }
  }

}
