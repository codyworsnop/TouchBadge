import { Component } from '@angular/core';
import { NavController, ModalController, Tabs } from 'ionic-angular';
import { LoginModal } from '../../modals/login/login';
import { LinkedInUtilityProvider } from '../../providers/linked-in-utility/linked-in-utility';
import { UserDataUtilityProvider } from '../../providers/user-data-utility/user-data-utility';
import { CalendarPage } from '../calendar/calendar';
import { ToastController } from 'ionic-angular';
import { DynamoDB } from '../../providers/providers';
const aws_exports = require('../../aws-exports').default;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  private taskTable: string = aws_exports.aws_resource_name_prefix + 'Events';

  firstName: string; 
  lastName: string; 
  id: string; 
  numConnections: number;
  jobTitle: string;
  location: string; 

  constructor(public navCtrl: NavController, public modalCtrl: ModalController, public ln: LinkedInUtilityProvider, public userData: UserDataUtilityProvider, private toastCtrl: ToastController, private db: DynamoDB) {
  }

  login() {

    this.ln.linkedInLogin().then(response => {
    
      this.firstName = this.userData.GetFirstName();
      this.lastName = this.userData.GetLastName();
      this.id = this.userData.GetId();
      this.numConnections = this.userData.GetNumConnections();
      this.jobTitle = this.userData.GetJobTitle();
      this.location = this.userData.GetLocation();

      const params = {
        'TableName': this.taskTable,
        'Item': { EventID: "0F87F8A6-79E2-46B7-8FEF-3930232549FD5", Name: "Cody's fish and supply conference", NewContacts: "32", EventDate: "1515571200000"},
        'ConditionExpression': 'attribute_not_exists(id)'
      };
      this.db.getDocumentClient()
        .then(client => client.put(params).promise())
        .catch(err => {

          console.log('add task error', err)
          this.alertUser("error: " + err)

        });


      

    }).catch(error => {

      console.log("error retrieving user");
    });
  }

  alertUser(message: string) { 

    let toast = this.toastCtrl.create({
      message: message,
      duration: 5000,
      position: 'bottom'

    });

    toast.present();
  }

  public navToEvent() {
    var tabs: Tabs = this.navCtrl.parent;
    tabs.select(2);
  }

}
