import { Component } from '@angular/core';
import { NavController, ModalController, Tabs } from 'ionic-angular';
import { LoginModal } from '../../modals/login/login';
import { LinkedInUtilityProvider } from '../../providers/linked-in-utility/linked-in-utility';
import { UserDataUtilityProvider } from '../../providers/user-data-utility/user-data-utility';
import { CalendarPage } from '../calendar/calendar';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  cards: any[] = [];
  firstName: string; 
  lastName: string; 
  id: string; 

  constructor(public navCtrl: NavController, public modalCtrl: ModalController, public ln: LinkedInUtilityProvider, public userData: UserDataUtilityProvider) {

    this.cards = [{ "title" : "Event", "subtitle" : "Team 11 Conference", "date" : "03/15/2018", "time" : "4:30 PM" },
                { "title" : "Seminar", "subtitle" : "Breadware meeting", "date" : "03/10/2018", "time" : "8:00 AM" },
                { "title" : "Seminar", "subtitle" : "Learning to write firmware", "date" : "03/11/2018", "time" : "7:00 PM" },
                { "title" : "Seminar", "subtitle" : "What is SASS anyway?", "date" : "03/11/2018", "time" : "7:00 PM" },
                { "title" : "Seminar", "subtitle" : "*ng what?", "date" : "03/11/2018", "time" : "7:00 PM" },
                { "title" : "New Contact!", "subtitle" : "Devrin Lee", "date" : "03/11/2018", "time" : "7:00 PM" },
                { "title" : "New Contact!", "subtitle" : "Connor Scully-Allison", "date" : "03/11/2018", "time" : "8:00 PM" }]; 
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

  public navToEvent() {
    var tabs: Tabs = this.navCtrl.parent;
    tabs.select(2);
  }

  public dismissNotification(card: any) {

    let index = this.cards.indexOf(card);
    if (index > -1) {
      this.cards.splice(index, 1);
    }
  }
}
