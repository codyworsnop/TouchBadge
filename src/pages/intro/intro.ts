import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { Slides } from 'ionic-angular';
import { UserDataUtilityProvider } from '../../providers/user-data-utility/user-data-utility';
import { LoggingUtilityProvider } from '../../providers/logging-utility/logging-utility';
import { DynamoDB } from '../../providers/aws.dynamodb';
import { LinkedInUtilityProvider } from '../../providers/linked-in-utility/linked-in-utility';
import { BluetoothUtilityProvider } from '../../providers/bluetooth-utility/bluetooth-utility';

/**
 * Generated class for the IntroPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-intro',
  templateUrl: 'intro.html',
})
export class IntroPage {

  @ViewChild(Slides) slides: Slides;
  devices: any[] = [];
  title: string;
  findingVis = false;
  deviceConnected = false;
  searchingVis = false;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public userData: UserDataUtilityProvider,
    public logginUtil: LoggingUtilityProvider,
    public db: DynamoDB,
    public ln: LinkedInUtilityProvider,
    public bluetoothUtility: BluetoothUtilityProvider) {
  }

  NavToHome() {
    this.title = "here";
    this.navCtrl.setRoot(TabsPage);
  }

  NavToIndex(slideIndex: number) {
    this.slides.slideTo(slideIndex, 500);
  }

  LinkedInLogin() {

    this.ln.linkedInLogin().then(response => {
      const params = {
        'TableName': "Users",
        'Item': { UserID: this.userData.GetAWSIdentityId(), First_Name: this.userData.GetFirstName(), Last_Name: this.userData.GetLastName(), JobTitle: this.userData.GetJobTitle(), Email: this.userData.GetEmailAddress(), PictureURL: this.userData.GetPictureUrl() },
        'ConditionExpression': 'attribute_not_exists(id)'
      };

      this.db.getDocumentClient()
        .then(client => {
          client.put(params).promise();
        })
        .catch(err => {
          console.log(err);
        });

      this.NavToIndex(2);

    }).catch(error => {

      console.log("error retrieving user");
    });

  }

  ScanDevices() {
    this.findingVis = true;

    this.bluetoothUtility.scan().then(data => {
      this.findingVis = false;
      this.searchingVis = true; 
      this.devices = data;
    });
  }

  ConnectToDevice(device) {

    this.bluetoothUtility.connect(device).then(() => {

      this.userData.SetBadgeStatus(true);

      this.searchingVis = false;
      this.deviceConnected = true;

      setTimeout(() => {
        this.NavToIndex(3);
      }, 1000);
    });
  }
}
