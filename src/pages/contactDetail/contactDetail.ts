import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';

@Component({
  selector: 'page-contactDetail',
  templateUrl: 'contactDetail.html'
})
export class ContactDetailPage {

  public contact: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController) {

    this.contact = this.navParams.get("contactInfo"); 

  }

}
