import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'modal-newContact',
  templateUrl: 'newContact.html'
})
export class newContactModal {

  constructor(public navCtrl: NavController) {

  }

  dismissModal() {
      this.navCtrl.pop();
  }
}
