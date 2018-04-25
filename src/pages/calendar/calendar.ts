import { Component, ViewChild } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { CalendarComponentOptions, DayConfig, CalendarComponent } from "ion2-calendar";
import { eventMap } from '../../modals/eventMap/eventMap';
import * as moment from 'moment';
import { HTTP } from '@ionic-native/http';
import { UserDataUtilityProvider } from '../../providers/user-data-utility/user-data-utility';
import { LoggingUtilityProvider } from '../../providers/logging-utility/logging-utility';
import { error } from 'util';

@Component({
  selector: 'page-calendar',
  templateUrl: 'calendar.html'
})
export class CalendarPage {

  @ViewChild('calendar') cal: CalendarComponent;
  date: string;
  type: 'string';

  displayedEvents: any[] = [];
  eventTitle: string;
  eventSubtitle: string;
  daySelected: string;

  userEvents: any[] = [];
  fetchEventsAPI = "https://e1hhlariwa.execute-api.us-west-2.amazonaws.com/Release/fetchuserevents";

  constructor(public navCtrl: NavController,
    public modalCtrl: ModalController,
    private http: HTTP,
    private userData: UserDataUtilityProvider,
    private loggingUtil: LoggingUtilityProvider) {
      


  }

  ionViewDidLoad() {
    this.RefreshCalendar();
  }

  onChange($event) {

    this.displayedEvents = [];
    this.daySelected = moment($event).format("LL");

    //collect events for the day
    this.userEvents.forEach(event => {

      var startDate = new Date(event.EventDate.Start.split('T')[0].split('-')[0], event.EventDate.Start.split('T')[0].split('-')[1] - 1, event.EventDate.Start.split('T')[0].split('-')[2]);
      var dateSelected = new Date($event);
      console.log("selected: " + startDate.getDate())
      if (startDate.getDate() == dateSelected.getDate() && startDate.getFullYear() == dateSelected.getFullYear() && startDate.getMonth() == dateSelected.getMonth()) {
        this.displayedEvents.push(event);
      }
    });
  }

  ViewOnMap() {
    let modal = this.modalCtrl.create(eventMap);
    modal.present();
  }

  RefreshCalendar()
  {
    this.userData.GetUserEvents().then(result => {
      this.cal.options = {
        daysConfig: result.calendarConfig,
      }
      this.userEvents = result.userEvents;
    }, error => {

      this.loggingUtil.alertUser("Error has occured: " + error);
    });
  }

  doRefresh(refresher) {
    this.RefreshCalendar();

    setTimeout(() => {
      refresher.complete();
    }, 2000);
  }
}
