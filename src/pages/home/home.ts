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

  ContactsToday: string;
  UpcomingEventCount: string;
  SeminarCount: string;
  BadgeStatus: string; 

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
    this.SetUserData();
  }

  ionViewWillEnter() { 
    this.SetStatusText();
  }

  SetStatusText() {
    
    this.userData.GetContactsToday().then(result => { 
      this.ContactsToday = result;
    });
    this.userData.GetUpcomingEventCount().then(result => {
      this.UpcomingEventCount = result;
      this.SeminarCount = result;
    });

    this.userData.GetBadgeStatus().then(result => {
      if (result) {
        this.BadgeStatus = "Connected"
      } else { 
        this.BadgeStatus = "Disconnected";
      }
    });
  }

  SetUserData() { 
    this.userData.GetFirstName().then((response) => 
    {
      this.firstName = response;
    });

    this.userData.GetLastName().then((response) => {
      this.lastName = response;
    });

    this.userData.GetId().then((response) => { 
      this.id = response;
    });

    this.userData.GetNumConnections().then((response) => {
      this.numConnections = response;
    });

    this.userData.GetJobTitle().then((response) => {
      this.jobTitle = response;
    });

    this.userData.GetLocation().then((response) => {
      this.location = response;
    });

    this.userData.GetPictureUrl().then((response) => { 
      this.pictureUrl = response;
    });
  }
}
