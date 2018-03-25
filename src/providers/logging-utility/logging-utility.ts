import { Injectable } from '@angular/core';
import { ToastController } from 'ionic-angular';

/*
  Generated class for the LoggingUtilityProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LoggingUtilityProvider {

  constructor(public toastCtrl: ToastController) {

  }

  alertUser(message: string) { 

    let toast = this.toastCtrl.create({
      message: message,
      showCloseButton: true,
      position: 'bottom',
    });

    toast.present();
  }

}
