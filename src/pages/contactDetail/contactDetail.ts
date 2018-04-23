import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { UserDataUtilityProvider } from '../../providers/user-data-utility/user-data-utility';

@Component({
  selector: 'page-contactDetail',
  templateUrl: 'contactDetail.html'
})
export class ContactDetailPage {

  public contact: any;
  public myPictureUrl: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, private userData: UserDataUtilityProvider) {

    this.contact = this.navParams.get("contactInfo"); 

  }

  ionViewDidLoad()
  {
    this.userData.GetPictureUrl().then(result => {
      this.myPictureUrl = result;
    });
  }

}
