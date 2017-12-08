import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-calendar',
  templateUrl: 'calendar.html'
})
export class CalendarPage {

  date: string;
  type: 'string';

  constructor(public navCtrl: NavController) {

  }
  
  onChange($event) {
    console.log($event);
  }
}
