import { Component } from '@angular/core';
import { NavController, List } from 'ionic-angular';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { ContactDetailPage } from '../contactDetail/contactDetail';
import { ModalController } from 'ionic-angular/components/modal/modal-controller';
import { newContactModal } from '../../modals/newContact/newContact';
import { DynamoDB } from '../../providers/providers';
import { LoggingUtilityProvider } from '../../providers/logging-utility/logging-utility';
import { UserDataUtilityProvider } from '../../providers/user-data-utility/user-data-utility';
import { HTTP } from '@ionic-native/http';

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {

  public contacts = [];
  groupedContacts = [];

  private userContactAPI = "https://n04wjzhe44.execute-api.us-west-2.amazonaws.com/Release/fetchusers";

  constructor(public navCtrl: NavController,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public db: DynamoDB,
    private loggingUtil: LoggingUtilityProvider,
    private userData: UserDataUtilityProvider,
    private http: HTTP) {
  }

  ionViewDidLoad() {
    this.retrieveContacts();
  }

  retrieveContacts() {

    // this.contacts = [];
    //  this.groupedContacts = [];

    this.userData.GetAWSIdentityId().then((id) => {
      this.http.get(this.userContactAPI + "?userID=" + id, {}, {}).then(response => {

        var result = JSON.parse(response.data);

        result.Contacts.forEach(contact => {

          if (this.contacts.indexOf(contact) != -1) {
            if (contact.PictureURL == 'null') {
              contact.PictureURL = "assets/img/default-profile-pic.jpg";

              this.contacts.push(contact);
            }

          }
        });

        this.groupContacts(this.contacts);

      }, error => {
        this.loggingUtil.alertUser("Error pulling: " + JSON.stringify(error));
      });

    });
  }

  groupContacts(contacts) {

    if (contacts != null) {
      let sortedContacts = contacts.sort((a, b) => a.Last_Name < b.Last_Name ? -1 : a.Last_Name > b.Last_Name ? 1 : 0);

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

    this.retrieveContacts();

    setTimeout(() => {
      refresher.complete();
    }, 2000);
  }
}
