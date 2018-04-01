import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { CalendarComponentOptions, DayConfig } from "ion2-calendar";
import { eventMap } from '../../modals/eventMap/eventMap';
import * as moment from 'moment';

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
  daySelected: string;

  calendarOptions: CalendarComponentOptions = {
    daysConfig: this.calendarConfig
  };

  constructor(public navCtrl: NavController, public modalCtrl: ModalController) {

    //load events from dynamo
    this.calendarConfig.push({
      date: new Date(2018, 2, 31),
      subTitle: "EVENT",
      marked: true,
    })

    this.eventInformation["2018-03-31"] = {
      title: "TouchBadge Progress Demo",
      subtitle: "Failure is always an option",
    }

  }

  public ClearEvent() {

    this.eventTitle = null;
    this.eventSubtitle = null;
  }

  onChange($event) {

    var dateEvent = this.eventInformation[JSON.stringify($event).split('"')[1].split('T')[0]];

    this.daySelected = moment($event).format("LL");

    if (dateEvent != null) {
      this.eventTitle = dateEvent.title;
      this.eventSubtitle = dateEvent.subtitle;
    }
    else
    {
      this.ClearEvent();
    }
  }

  ViewOnMap() { 
    let modal = this.modalCtrl.create(eventMap);
    modal.present();
  }
}
