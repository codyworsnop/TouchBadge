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
  private contactsToPull = [];

  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public modalCtrl: ModalController, public db: DynamoDB, private loggingUtil: LoggingUtilityProvider, private userData: UserDataUtilityProvider) {

    console.log("looking for: " + this.userData.GetAWSIdentityId());
    this.retrieveContacts();

  }

  retrieveContacts() {

    this.contacts = [];
    this.groupedContacts = [];
    this.contactsToPull = [];

    var awsIdentity: any;

    this.userData.GetAWSIdentityId().then((response) => {
      awsIdentity = response;

      const params = {
        TableName: 'Users',
        KeyConditionExpression: 'UserID = :id',
        ExpressionAttributeValues: {
          ':id': awsIdentity,
        },
        ProjectionExpression: 'Contacts',
      };

      this.db.getDocumentClient().then(client => {

        client.query(params, (err, data) => {

          if (err) {
            console.log(err);
            this.loggingUtil.alertUser("Error pulling: " + err.message);
          }
          else {

            console.log("pulled: " + JSON.stringify(data.Items[0].Contacts));
            data.Items[0].Contacts.forEach((contact) => {

              if (contact.id != null) {

                console.log(JSON.stringify(contact))
                this.contactsToPull.push(contact.id);
              }
              else {

                if (contact.PictureURL == 'null') {
                  contact.PictureURL = "assets/img/default-profile-pic.jpg";
                }

                this.contacts.push(contact);
                console.log("pushed contact: " + JSON.stringify(contact));
              }
            });

            this.retrieveAllContacts().then(() => {
              this.groupContacts(this.contacts);
            });
          }
        });
      });
    });
  }

  retrieveAllContacts(): Promise<any> {

    var returnedContacts = 0;
    console.log("length of contacts: " + this.contactsToPull.length);
    return new Promise((resolve, reject) => {
      this.contactsToPull.forEach((id) => {
        this.db.RetrieveContactFromDynamo(id).then((response) => {

          console.log("response from Db: " + JSON.stringify(response.Items[0]));

          this.contacts.push(response.Items[0])
          returnedContacts++;

          console.log("returnedContacts: " + returnedContacts);
          if (this.contactsToPull.length == returnedContacts) {
            resolve();
          }

        });
      });
    })
  }

  groupContacts(contacts) {

    if (contacts != null) {
      let sortedContacts = contacts.sort((a, b) => a.Last_Name < b.Last_Name ? -1 : a.Last_Name > b.Last_Name ? 1 : 0);

      console.log("sorted: " + sortedContacts);
      let currentLetter: string;
      let currentContacts: any[];

      sortedContacts.forEach((value, index) => {

        console.log("LAST NAME: " + value.Last_Name);
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
