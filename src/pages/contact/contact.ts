import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { ContactDetailPage } from '../contactDetail/contactDetail';
import { ModalController } from 'ionic-angular/components/modal/modal-controller';
import { newContactModal } from '../../modals/newContact/newContact';
import { DynamoDB } from '../../providers/providers';
import { LoggingUtilityProvider } from '../../providers/logging-utility/logging-utility';
import { UserDataUtilityProvider } from '../../providers/user-data-utility/user-data-utility';

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {

  public contacts = [];
  groupedContacts = [];

  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public modalCtrl: ModalController, public db: DynamoDB, private loggingUtil: LoggingUtilityProvider, private userData: UserDataUtilityProvider) {

    console.log("looking for: " + this.userData.GetAWSIdentityId());
    this.retrieveContacts();

  }

  retrieveContacts() {

    this.contacts = [];
    this.groupedContacts = [];

    const params = {
      TableName: 'Users',
      KeyConditionExpression: 'UserID = :id',
      ExpressionAttributeValues: {
        ':id': this.userData.GetAWSIdentityId(),
      },
      ProjectionExpression: 'Contacts',
    };

    this.db.getDocumentClient()
      .then(client => {

        client.query(params, (err, data) => {

          if (err) {
            console.log(err);
            this.loggingUtil.alertUser("Error pulling: " + err.message);
          }
          else {

            //this.loggingUtil.alertUser("pulled: " + JSON.stringify(data.Items[0].Contacts));
            data.Items[0].Contacts.forEach((contact) => {

                console.log("CONTACT: " + JSON.stringify(contact));

                if (contact.PictureURL == 'null') {
                  contact.PictureURL = "../assets/img/default-profile-pic.jpg";
                }
  
                this.contacts.push(contact);
              
            });

            this.groupContacts(this.contacts);
          }
        });
      });
  }

  groupContacts(contacts) {

    if (contacts != null) {
      let sortedContacts = contacts.sort((a, b) => a.Last_Name < b.Last_Name ? -1 : a.Last_Name > b.Last_Name ? 1 : 0);

      console.log(sortedContacts);
      let currentLetter: string;
      let currentContacts: any[];

      sortedContacts.forEach((value, index) => {

        if (value.Last_Name != undefined && value.Last_Name.charAt(0).toUpperCase() != currentLetter) {

          currentLetter = value.Last_Name.charAt(0).toUpperCase();

          let newGroup = {
            letter: currentLetter,
            contacts: []
          };

          currentContacts = newGroup.contacts;
          this.groupedContacts.push(newGroup);
        }

        currentContacts.push(value);
      });
    }
  }

  addContact() {

    let modal = this.modalCtrl.create(newContactModal);
    modal.present();
  }

  deleteContact(contact) {

    let index = this.contacts.indexOf(contact);

    if (index > -1) {
      this.contacts.splice(index, 1);
    }
  }

  contactTapped(contact: any): void {

    this.navCtrl.push(ContactDetailPage, { contactInfo: contact });
  }

  doRefresh(refresher) {
    console.log('Begin async operation', refresher);

    this.retrieveContacts();
    
    setTimeout(() => {
      console.log('Async operation has ended');
      refresher.complete();
    }, 2000);
  }
}
