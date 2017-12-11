import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';

@Component({
  selector: 'page-contactDetail',
  templateUrl: 'contactDetail.html'
})
export class ContactDetailPage {

  contacts;
  groupedContacts = [];

  constructor(public navCtrl: NavController, public alertCtrl: AlertController) {

    this.contacts = [
      {
        name: "Cody Worsnop",
        number: "(775) 224-7230"
      },
      {
        name: "Evan Grill",
        number: "(775) 684-5625"
      },
      {
        name: "Jon Weatherspoon",
        number: "(775) 293-2312"
      }
    ];

    this.groupContacts(this.contacts);
  }

  groupContacts(contacts){

    let sortedContacts = contacts.sort();
    let currentLetter = false; 
    let currentContacts: any[];

    sortedContacts.forEach((value, index) => {

      if (value.name.charAt(0) != currentLetter) {

        currentLetter = value.name.charAt(0);
        
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

  addContact() {

    let prompt = this.alertCtrl.create({
      title: 'Add Contact',
      inputs: [{
        name: 'name'
      }],
      buttons: [{
        text: 'Cancel'
      },
      {
        text: 'Add',
        handler: data => {
          this.contacts.push(data);
          this.groupContacts(this.contacts);
        }
      }
      ]
    });

    prompt.present();
  }

  deleteContact(contact){

    let index = this.contacts.indexOf(contact);

    if (index > -1){
      this.contacts.splice(index, 1);
    }
  }
}
