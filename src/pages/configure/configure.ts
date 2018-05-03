import { Component, NgZone } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { UserDataUtilityProvider } from '../../providers/user-data-utility/user-data-utility';

@Component({
  selector: 'page-configure',
  templateUrl: 'configure.html'
})

export class ConfigurePage {

  bumpAllowed: boolean = true;
  AppVersion: string;
  BadgeStatus: string;
  BadgeVersion: string;
  BadgeModel: string;

  constructor(
    private ngZone: NgZone, private userData: UserDataUtilityProvider) {
  }

  updateBumpAllowed(value: any)
  {
    this.userData.SetBumpAllowed(value);
  }

  ionViewDidLoad() {
    this.AppVersion = '1.0';
    this.BadgeModel = 'TouchBadge m103';
    this.BadgeVersion = 'TB1.0';

    this.userData.GetBumpAllowed().then(result => {
      this.bumpAllowed = result;
    });

    this.userData.GetBadgeStatus().then(result => {
      if (result) {
        this.BadgeStatus = "Connected"
      } else { 
        this.BadgeStatus = "Disconnected";
      }
    });
    
  }
}
