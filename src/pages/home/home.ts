import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { LoginModal } from '../../modals/login/login';
import { LinkedInUtilityProvider } from '../../providers/linked-in-utility/linked-in-utility';
import { UserDataUtilityProvider } from '../../providers/user-data-utility/user-data-utility';
import { CalendarPage } from '../calendar/calendar';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  cards: any;
  firstName: string; 
  lastName: string; 
  id: string; 

  constructor(public navCtrl: NavController, public modalCtrl: ModalController, public ln: LinkedInUtilityProvider, public userData: UserDataUtilityProvider) {

    this.cards = [{ "title" : "Event", "subtitle" : "pulling your hair out with ionic", "date" : "03/15/2018", "time" : "4:30 PM" },
                { "title" : "Seminar", "subtitle" : "Breadware meeting", "date" : "03/10/2018", "time" : "8:00 AM" },
                { "title" : "Event", "subtitle" : "Learning to write firmware", "date" : "03/11/2018", "time" : "7:00 PM" }]; 
  }

  login() {

    this.ln.linkedInLogin().then(response => {

      this.firstName = this.userData.GetFirstName();
      this.lastName = this.userData.GetLastName();
      this.id = this.userData.GetId();

    }).catch(error => {

      console.log("error retrieving user");
    });

    //let modal = this.modalCtrl.create(LoginModal);
    //modal.present();
  }

  public navEvents() {
    this.navCtrl.push(CalendarPage);
  }
}
