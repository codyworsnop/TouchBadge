import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { DynamoDB } from '../../providers/providers';

@Component({
  selector: 'modal-newContact',
  templateUrl: 'newContact.html'
})
export class newContactModal {

  FirstName: string;
  LastName: string;
  CompanyName: string;
  JobTitle: string;

  constructor(public navCtrl: NavController, private db: DynamoDB) {

  }

  dismissModal() {
      this.navCtrl.pop();
  }

  AddContact() {
    
    var newContact = {
      FirstName: this.FirstName,
      LastName: this.LastName,
      JobTitle: this.JobTitle,
      Company: this.CompanyName,
    };

    this.db.AddContactToDynamo([newContact]);
    this.navCtrl.pop();
  }
}
