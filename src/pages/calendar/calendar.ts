import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { CalendarComponentOptions, DayConfig } from "ion2-calendar";
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

  date: string;
  type: 'string';
  calendarConfig: DayConfig[] = [];

  displayedEvents: any[] = [];
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

    this.loggingUtil.alertUser("In constructor");

    this.userData.GetUserEvents().then(result => {

      this.loggingUtil.alertUser("Setting events: " + JSON.stringify(result));
      this.calendarConfig = result.calendarConfig;
      this.userEvents = result.userEvents;
    }, error => {

      this.loggingUtil.alertUser("Error has occured: " + error);
    });

  }

  ionViewDidLoad() {

    this.userData.GetAWSIdentityId().then((id) => {
      this.http.get(this.fetchEventsAPI + "?userID=" + id, {}, {}).then(response => {
        var result = JSON.parse(response.data);

        result.Events.forEach(event => {
          this.userEvents.push(event);

          var date = event.EventDate.Start.split('-')[1] as number;
          this.calendarConfig.push({
            date: new Date(event.EventDate.Start.split('-')[0], date - 1, event.EventDate.Start.split('-')[2].split(' ')[0]),
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
