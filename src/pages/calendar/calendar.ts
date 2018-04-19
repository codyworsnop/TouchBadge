import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { CalendarComponentOptions, DayConfig } from "ion2-calendar";
import { eventMap } from '../../modals/eventMap/eventMap';
import * as moment from 'moment';
import { HTTP } from '@ionic-native/http';
import { UserDataUtilityProvider } from '../../providers/user-data-utility/user-data-utility';
import { LoggingUtilityProvider } from '../../providers/logging-utility/logging-utility';

@Component({
  selector: 'page-calendar',
  templateUrl: 'calendar.html'
})
export class CalendarPage {

  date: string;
  type: 'string';
  calendarConfig: DayConfig[] = [];

  displayedEvents: any[];
  eventTitle: string;
  eventSubtitle: string;
  daySelected: string;

  userEvents: any[] = [];
  fetchEventsAPI = "https://e1hhlariwa.execute-api.us-west-2.amazonaws.com/Release/fetchuserevents";

  calendarOptions: CalendarComponentOptions = {
    daysConfig: this.calendarConfig
  };

  constructor(public navCtrl: NavController,
    public modalCtrl: ModalController,
    private http: HTTP,
    private userData: UserDataUtilityProvider,
    private loggingUtil: LoggingUtilityProvider) {

      this.calendarConfig.push({
        date: new Date(2018, 4, 20),
        subTitle: "EVENT",
        marked: true,
      });
  }

  ionViewDidLoad() {

    this.userData.GetAWSIdentityId().then((id) => {
      this.http.get(this.fetchEventsAPI + "?userID=" + id, {}, {}).then(response => {
        var result = JSON.parse(response.data);

        result.Events.forEach(event => {
          this.userEvents.push(event);

          this.loggingUtil.alertUser("year: " + event.EventDate.Start.split('-')[0]);
          this.loggingUtil.alertUser("month: " + event.EventDate.Start.split('-')[1]);
          this.loggingUtil.alertUser("days: " + event.EventDate.Start.split('-')[2]);

          this.calendarConfig.push({
            date: new Date(event.EventDate.Start.split('-')[0], event.EventDate.Start.split('-')[1], event.EventDate.Start.split('-')[2]),
            subTitle: "EVENT",
            marked: true,
          });
        });

      }, error => {
        this.loggingUtil.alertUser("error getting events: " + JSON.stringify(error))
      });
    });
  }

  onChange($event) {

    this.displayedEvents = [];
    this.daySelected = moment($event).format("LL");

    //collect events for the day
    this.userEvents.forEach(event => {
      if (event.EventDate.Start.split(' ')[0] == JSON.stringify($event).split('"')[1].split('T')[0]) {
        this.displayedEvents.push(event);
      }
    });
  }

  ViewOnMap() {
    let modal = this.modalCtrl.create(eventMap);
    modal.present();
  }
}
