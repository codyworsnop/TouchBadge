import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { CalendarComponentOptions, DayConfig } from "ion2-calendar";
import { stringify } from 'querystring';
import { Moment } from 'moment';

@Component({
  selector: 'page-calendar',
  templateUrl: 'calendar.html'
})
export class CalendarPage {

  date: string;
  type: 'string';
  calendarConfig: DayConfig[] = [];
  eventInformation: any = {};

  info: any;
  eventTitle: string;
  eventSubtitle: string;

  calendarOptions: CalendarComponentOptions = {
    daysConfig: this.calendarConfig
  };

  constructor(public navCtrl: NavController, public modalCtrl: ModalController) {

    //load events from dynamo
    this.calendarConfig.push({
      date: new Date(2018, 2, 15),
      subTitle: "EVENT",
      marked: true,
    })

    this.eventInformation["2018-03-15"] = {
      title: "TouchBadge Progress Demo",
      subtitle: "Failure is always an option",
    }

  }

  onChange($event) {

    var dateEvent = this.eventInformation[JSON.stringify($event).split('"')[1].split('T')[0]];

    if (dateEvent != null) {
      this.eventTitle = dateEvent.title;
      this.eventSubtitle = dateEvent.subtitle;
    }
  }
}
