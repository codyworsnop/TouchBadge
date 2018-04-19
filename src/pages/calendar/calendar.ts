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
  eventsInformation: any = {};

  displayedEvents: any[];
  info: any;
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
  }

  ionViewDidLoad() {

    this.userData.GetAWSIdentityId().then((id) => {
      this.http.get(this.fetchEventsAPI + "?userID=" + id, {}, {}).then(response => {
        var result = JSON.parse(response.data);

        result.Events.forEach(event => {
          this.userEvents.push(event);

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

  public ClearEvent() {

    this.eventTitle = null;
    this.eventSubtitle = null;
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

    if (this.displayedEvents.length == 0) {

      this.ClearEvent();
    }
  }

  ViewOnMap() {
    let modal = this.modalCtrl.create(eventMap);
    modal.present();
  }
}
