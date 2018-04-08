import { Component } from '@angular/core';
import { NavController, ModalController, Tabs } from 'ionic-angular';
import { LinkedInUtilityProvider } from '../../providers/linked-in-utility/linked-in-utility';
import { UserDataUtilityProvider } from '../../providers/user-data-utility/user-data-utility';
import { DynamoDB } from '../../providers/providers';
import { LoggingUtilityProvider } from '../../providers/logging-utility/logging-utility';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  firstName: string; 
  lastName: string; 
  id: string; 
  numConnections: number;
  jobTitle: string;
  location: string; 
  pictureUrl: string;

  constructor(public navCtrl: NavController,
    public modalCtrl: ModalController,
    public ln: LinkedInUtilityProvider,
    public userData: UserDataUtilityProvider,
    private db: DynamoDB,
    private loggingUtil: LoggingUtilityProvider) {
  }

  public navToEvent() {
    var tabs: Tabs = this.navCtrl.parent;
    tabs.select(2);
  }

  ionViewDidLoad() { 
    console.log("HOME DID LOAD!?!?");
    this.SetUserData();
  }

  SetUserData() { 
    this.firstName = this.userData.GetFirstName();
    this.lastName = this.userData.GetLastName();
    this.id = this.userData.GetId();
    this.numConnections = this.userData.GetNumConnections();
    this.jobTitle = this.userData.GetJobTitle();
    this.location = this.userData.GetLocation();
    this.pictureUrl = this.userData.GetPictureUrl();  
  }
}
