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
  public groupedContacts = [];
  private currentContacts: any[] = [];
  private contactsHaveLoaded: boolean = false;

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

    this.contacts = [];
    var found = false;
    this.userData.GetAWSIdentityId().then((id) => {
      this.http.get(this.userContactAPI + "?userID=" + id, {}, {}).then(response => {

        var result = JSON.parse(response.data);

        result.Contacts.forEach(contact => {

          if (contact.PictureURL == 'null') {
            contact.PictureURL = "assets/img/default-profile-pic.jpg";
          }
          this.contacts.push(contact);
        });

        this.groupContacts(this.contacts);

      }, error => {
        this.loggingUtil.alertUser("Error pulling: " + JSON.stringify(error));
      });

    });
  }

  RemoveUnexisting() {

  //  console.log("Contact list: " + JSON.stringify(this.contacts));

    for (var i = 0; i < this.groupedContacts.length; i++) {
      for (var j = 0; j < this.groupedContacts[i].contacts.length; j++) {

        console.log("groupedcontacts:" + JSON.stringify(this.groupedContacts[i]));
        if (this.contacts.findIndex(element => {
          console.log("group firstname: " + this.groupedContacts[i].contacts[j].First_Name + ", contact firstname: " + element.First_Name)
          return (element.First_Name == this.groupedContacts[i].contacts[j].First_Name &&
            element.Last_Name == this.groupedContacts[i].contacts[j].Last_Name);
        }) == -1) {
          console.log("deleting at indexes: " + i + ", " + j);
          this.groupedContacts[i].contacts.splice(j, 1);
          j--;

          if (this.groupedContacts[i].contacts.length == 0) {
            this.groupedContacts.splice(i, 1);
            i--;
          }
        }
      }
    }
  }


  groupContacts(contacts) {

    let currentLetter: string;
    var found = false;
    var contactExists = false;
    var groupIndex = -1
    
    if (contacts != null) {

      let sortedContacts = contacts.sort((a, b) => a.Last_Name < b.Last_Name ? -1 : a.Last_Name > b.Last_Name ? 1 : 0);
      this.RemoveUnexisting();

      sortedContacts.forEach((value, index) => {

        groupIndex = -1;
        if (this.contactsHaveLoaded) {
          found = false;
          for (var i = 0; i < this.groupedContacts.length; i++) {
            if (this.groupedContacts[i].letter == value.Last_Name.charAt(0).toUpperCase()) {
              groupIndex = i;
              break;
            }
          }

          //console.log("group index: " + groupIndex + "contact: " + value.First_Name)

          if (groupIndex != -1) {
            for (var j = 0; j < this.groupedContacts[groupIndex].contacts.length; j++) {
              if (this.groupedContacts[groupIndex].contacts[j].First_Name == value.First_Name &&
                this.groupedContacts[groupIndex].contacts[j].Last_Name == value.Last_Name) {
                found = true;
              }
            }
          }
        }

        if (value.Last_Name != undefined && value.Last_Name.charAt(0).toUpperCase() != currentLetter && groupIndex == -1) {
          currentLetter = value.Last_Name.charAt(0).toUpperCase();

          if (!found) {
          //  console.log("creating new group: " + currentLetter);
            let newGroup = {
              letter: currentLetter,
              contacts: []
            };

            this.currentContacts = newGroup.contacts;
            this.groupedContacts.push(newGroup);
          }
        }
      //  console.log("found: " + found + ", groupIndex: " + groupIndex + ", contactloaded: " + this.contactsHaveLoaded + ", contact: " + value.First_Name);

        if (!found) {
          if (groupIndex != -1 && this.contactsHaveLoaded) {
            this.groupedContacts[groupIndex].contacts.push(value);
          }
          else {
            this.currentContacts.push(value);
          }
        }
      });

      this.contactsHaveLoaded = true;
      this.groupedContacts.sort((a, b) => a.letter < b.letter ? -1 : a.letter > b.letter ? 1 : 0);
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
