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

    //load events from dynamo
    this.calendarConfig.push({
      date: new Date(2018, 2, 31),
      subTitle: "EVENT",
      marked: true,
    });
  }

  ionViewDidLoad() {

    this.userData.GetAWSIdentityId().then((id) => {
      this.http.get(this.fetchEventsAPI + "?userID=" + id, {}, {}).then(response => {
        var result = JSON.parse(response.data);

        this.loggingUtil.alertUser("got events");
        result.Events.forEach(event => {

          this.loggingUtil.alertUser("pushing event: " + event);
          this.userEvents.push(event);
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

    this.loggingUtil.alertUser("dah heck");
    this.displayedEvents = [];
    this.daySelected = moment($event).format("LL");

    this.loggingUtil.alertUser("looking for user events: " + this.userEvents);
    //collect events for the day
    this.userEvents.forEach(event => {
      
      this.loggingUtil.alertUser("date: " + event.EventDate.Start.split(' ')[0]);
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
