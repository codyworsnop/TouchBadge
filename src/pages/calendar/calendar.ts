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
    })



    this.eventsInformation["2018-04-10"] = {
      dateEvents: [
        {
          title: "Team #14",
          subtitle: "Data Visualization for SAN planner OR Data Visualization",
        },
        {
          title: "Team #36",
          subtitle: "GE: State-Based Plot Coloring",
        },
        {
          title: "Team #11",
          subtitle: "BreadWare - TouchBadge: An Internet Connected Lanyard for Conferences",
        },
        {
          title: "Team #18",
          subtitle: "Nevada Challenger Center: Interactive Visitor App for the Nevada Space Center",
        },
        {
          title: "Team #02",
          subtitle: "Let's VR - Multiplayer VR Game",
        },
        {
          title: "Team #34",
          subtitle: "Mobile Application for Weightlifting Tracking",
        }
      ]
    }
  }

  ionViewDidLoad() {

    this.userData.GetAWSIdentityId().then((id) => {
      this.http.get(this.fetchEventsAPI + "?userID=" + id, {}, {}).then(response => {
        var result = JSON.parse(response.data);

        result.Events.forEach(element => {
          this.loggingUtil.alertUser("event: " + JSON.stringify(element))
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

    console.log("CHANGED");
    this.displayedEvents = [];


    var dateEvent = this.eventsInformation[JSON.stringify($event).split('"')[1].split('T')[0]];
    this.daySelected = moment($event).format("LL");

    console.log("date event: " + dateEvent);

    if (dateEvent != null) {

      for (var i = 0; i < this.eventsInformation["2018-04-10"].dateEvents.length; i++) {

        this.displayedEvents.push(this.eventsInformation["2018-04-10"].dateEvents[i])
      }

      console.log("de: " + JSON.stringify(this.displayedEvents));
    }
    else {
      this.ClearEvent();
    }
  }

  ViewOnMap() {
    let modal = this.modalCtrl.create(eventMap);
    modal.present();
  }
}
