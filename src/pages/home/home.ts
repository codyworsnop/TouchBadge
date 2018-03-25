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

  constructor(public navCtrl: NavController, public modalCtrl: ModalController, public ln: LinkedInUtilityProvider, public userData: UserDataUtilityProvider, private db: DynamoDB, private loggingUtil: LoggingUtilityProvider) {
  }

  login() {

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
        'Item': { UserID: this.userData.GetAWSIdentityId(), First_Name: this.firstName, Last_Name: this.lastName, JobTitle: this.jobTitle, Email: this.userData.GetEmailAddress(), PictureURL: this.pictureUrl},
        'ConditionExpression': 'attribute_not_exists(id)'
      };
      
      this.db.getDocumentClient()
        .then(client => {
          
          client.put(params).promise();
        })
        .catch(err => {
  
          console.log(err);
          this.loggingUtil.alertUser(err);
        });

    }).catch(error => {

      console.log("error retrieving user");
    });
    
  }

  public navToEvent() {
    var tabs: Tabs = this.navCtrl.parent;
    tabs.select(2);
  }

}
