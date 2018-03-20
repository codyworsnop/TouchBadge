import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { ContactDetailPage } from '../contactDetail/contactDetail';
import { ModalController } from 'ionic-angular/components/modal/modal-controller';
import { newContactModal } from '../../modals/newContact/newContact';

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {

  contacts;
  groupedContacts = [];

  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public modalCtrl: ModalController) {

    this.contacts = [
      {
        name: "cody worsnop",
        description: "Student Worker at Unified Communication"
      },
      {
        name: "Jon Weatherspoon",
        description: "Student extraordinaire "
      },
      {
        name: "Evan Grill",
        description: "Manager at @one, MIKC UNR"
      },
      {
        name: "Devrin Lee",
        description: "Professor and Lady"
      },
      {
        name: "Danny D",
        description: "BreadWare CEO"
      },
      {
        name: "Dillon sadde",
        description: "Some Made up Name"
      }
    ]

    this.groupContacts(this.contacts);
  }

  groupContacts(contacts){

  if (contacts  != null) {
    let sortedContacts = contacts.sort();
    let currentLetter: string; 
    let currentContacts: any[];

    sortedContacts.forEach((value, index) => {

      if (value.name.charAt(0).toUpperCase() != currentLetter) {

        currentLetter = value.name.charAt(0).toUpperCase();
        
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

  deleteContact(contact){

    let index = this.contacts.indexOf(contact);

    if (index > -1){
      this.contacts.splice(index, 1);
    }
  }

  contactTapped() : void {
    this.navCtrl.push(ContactDetailPage);
  }
}
