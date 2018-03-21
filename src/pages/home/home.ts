import { Component } from '@angular/core';
import { NavController, ModalController, Tabs } from 'ionic-angular';
import { LoginModal } from '../../modals/login/login';
import { LinkedInUtilityProvider } from '../../providers/linked-in-utility/linked-in-utility';
import { UserDataUtilityProvider } from '../../providers/user-data-utility/user-data-utility';
import { CalendarPage } from '../calendar/calendar';
import { ToastController } from 'ionic-angular';
import { DynamoDB } from '../../providers/providers';

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

  constructor(public navCtrl: NavController, public modalCtrl: ModalController, public ln: LinkedInUtilityProvider, public userData: UserDataUtilityProvider, private toastCtrl: ToastController, private db: DynamoDB) {
  }

  login() {

    this.ln.getAWSToken();
/*
    this.ln.linkedInLogin().then(response => {
    
      this.firstName = this.userData.GetFirstName();
      this.lastName = this.userData.GetLastName();
      this.id = this.userData.GetId();
      this.numConnections = this.userData.GetNumConnections();
      this.jobTitle = this.userData.GetJobTitle();
      this.location = this.userData.GetLocation();
      this.pictureUrl = this.userData.GetPictureUrl();    

      const params = {
        'TableName': "Users",
        'Item': { UserID: this.userData.GetAWSIdentityId(), First_Name: this.firstName, Last_Name: this.lastName},
        'ConditionExpression': 'attribute_not_exists(id)'
      };
      
      this.db.getDocumentClient()
        .then(client => {
          
          client.put(params).promise();
          this.alertUser("client: " + client);
          this.alertUser("Token: " + this.userData.GetAWSToken());
          this.alertUser("id: " + this.userData.GetAWSIdentityId());
          this.alertUser("Putting to db: " + JSON.stringify(params.Item));
        })
        .catch(err => {
  
          console.log(err);
          this.alertUser(err);
  
        });

    }).catch(error => {

      console.log("error retrieving user");
    });
    */
  }

  alertUser(message: string) { 

    let toast = this.toastCtrl.create({
      message: message,
      showCloseButton: true,
      position: 'bottom'

    });

    toast.present();
  }

  public navToEvent() {
    var tabs: Tabs = this.navCtrl.parent;
    tabs.select(2);
  }

}
