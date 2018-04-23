import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { String } from 'aws-sdk/clients/cloudwatchevents';
import { LoggingUtilityProvider } from '../logging-utility/logging-utility';
import { HTTP } from '@ionic-native/http';
import { Platform } from 'ionic-angular';
import * as moment from 'moment';
/*
  Generated class for the UserDataUtilityProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UserDataUtilityProvider {

  private firstName: string;
  private lastName: string;
  private id: string;
  private jobTitle: string;
  private location: string;
  private numConnections: number;
  private pictureUrl: string;
  private emailAddress: string;

  private AWSToken: string;
  private AWSIdentityId: string;

  private calendarConfig: any[];
  private userEvents: any[];

  private ContactsToday: string;
  private SeminarCount: string;
  private BadgeStatus: string;

  private fetchEventsAPI = "https://e1hhlariwa.execute-api.us-west-2.amazonaws.com/Release/fetchuserevents";

  private userContactAPI = "https://n04wjzhe44.execute-api.us-west-2.amazonaws.com/Release/fetchusers";

  constructor(public storage: Storage,
    public logging: LoggingUtilityProvider,
    private http: HTTP,
    private loggingUtil: LoggingUtilityProvider,
    private platform: Platform) {
  }

  public SetUserData(first: string, last: string, id: string, jobTitle: string, location: string, numConnections: number, pictureUrl: string, emailAddress: string) {

    // console.log("fn: " + first + ", ln: " + last + ", id: " + id + ", jobTitle: " + jobTitle + ", location: " + location + ", num: " + numConnections);
    this.firstName = first;
    this.lastName = last;
    this.jobTitle = jobTitle;
    this.location = location;
    this.numConnections = numConnections;
    this.pictureUrl = pictureUrl;
    this.emailAddress = emailAddress;

    this.id = id;
  }

  public saveUserData(): Promise<any> {
    return new Promise((resolve, reject) => {
      var userData = {
        'FirstName': this.firstName,
        'LastName': this.lastName,
        'JobTitle': this.jobTitle,
        'Location': this.location,
        'numConnections': this.numConnections,
        'pictureURL': this.pictureUrl,
        'emailAddress': this.emailAddress,
        'id': this.id,
        'awsID': this.AWSIdentityId,
        'awsToken': this.AWSToken,
      };

      this.storage.set('userProfile', userData).then(() => {
        resolve();
      });
    });
  }

  private GetUserEventInfo(awsIdentity: any): Promise<any> {
    return new Promise((resolve, reject) => {

      this.userEvents = [];
      this.calendarConfig = [];

      this.http.get(this.fetchEventsAPI + "?userID=" + awsIdentity, {}, {}).then(response => {

        console.log("response: " + JSON.stringify(response));
        var result = JSON.parse(response.data);
        result.Events.forEach(event => {

          this.userEvents.push(event);

          var eventDate = new Date(event.EventDate.Start);
          eventDate.setDate(eventDate.getDate() + 1);

          this.calendarConfig.push({
            date: eventDate,
            subTitle: "EVENT",
            marked: true,
          });

        });
        resolve();
      }, error => {
        console.log("error: " + error);
        reject();
      });
    });
  }


  private retrieveUserData(): Promise<any> {

    if (this.platform.is('cordova')) {
      return new Promise((resolve, reject) => {
        this.storage.get('userProfile').then((result) => {
          this.firstName = result.FirstName;
          this.lastName = result.LastName;
          this.jobTitle = result.JobTitle;
          this.location = result.Location;
          this.numConnections = result.numConnections;
          this.pictureUrl = result.pictureURL;
          this.emailAddress = result.emailAddress;

          this.AWSIdentityId = result.awsID;
          this.id = result.id;

          this.userEvents = result.userEvents;
          this.calendarConfig = result.calendarConfig;


          resolve();
        }).catch((error) => {

          console.log("Error retrieving data: " + error);
          reject(error);
        });
      });

    }
  }

  GetContactsToday(): Promise<any> {

    return new Promise((resolve, reject) => {

        this.GetAWSIdentityId().then((id) => {
          this.http.get(this.userContactAPI + "?userID=" + id, {}, {}).then(response => {

            var result = JSON.parse(response.data);

            this.ContactsToday = result.Contacts.length;
            resolve(result.Contacts.length)

          }, error => {
            this.loggingUtil.alertUser("Error pulling: " + JSON.stringify(error));
          });

        });
      
    });
  }

  SetContactsToday(value: string) {
    this.ContactsToday = value;
  }

  GetSeminarsCount(): Promise<any> {
    return new Promise((resolve, reject) => {

    });
  }
  SetSeminarCount(value: string) {
    this.SeminarCount = value;
  }

  GetBadgeStatus(): Promise<any> {
    return new Promise((resolve, reject) => {
      resolve(false);
    });
  }

  SetBadgeStatus(value: string) {
    this.BadgeStatus = value;
  }

  GetUpcomingEventCount(): Promise<any> {
    return new Promise((resolve, reject) => {
      
      if (this.userEvents == undefined) {
        this.GetUserEvents().then(result => {
          
          resolve(this.userEvents.length);
        });
      } else {
        resolve(this.userEvents.length);
      }
    });
  }

  public SetAWSToken(value: string) {
    this.AWSToken = value;
  }

  public SetAWSIdentityId(value: string) {
    this.AWSIdentityId = value;
  }

  public GetAWSToken(): Promise<any> {

    return new Promise((resolve, reject) => {

      if (this.platform.is('cordova')) {
        if (this.AWSToken == undefined) {
          this.retrieveUserData().then(() => {
            resolve(this.AWSToken);
          });
        }
        else {
          resolve(this.AWSToken);
        }
      }
      else {
        resolve('us-west-2:f3b94a53-7ee6-4f06-b927-9ac4940ebc8b');
      }
    });
  }

  public GetUserEvents(): Promise<any> {

    return new Promise((resolve, reject) => {
      if (this.userEvents == undefined || this.calendarConfig == undefined) {
        if (this.platform.is('cordova')) {
          this.GetAWSIdentityId().then(id => {

            this.GetUserEventInfo(id).then(() => {

              resolve({
                calendarConfig: this.calendarConfig,
                userEvents: this.userEvents
              });
            });
          });
        }
      } else {
        resolve({
          calendarConfig: this.calendarConfig,
          userEvents: this.userEvents
        });
      }
    });
  }

  public GetAWSIdentityId(): Promise<any> {

    return new Promise((resolve, reject) => {
      if (this.platform.is('cordova')) {
        if (this.AWSIdentityId == undefined) {
          this.retrieveUserData().then(() => {
            resolve(this.AWSIdentityId);
          });
        }
        else {
          resolve(this.AWSIdentityId);
        }
      }
    });

  }

  public GetEmailAddress(): Promise<any> {

    return new Promise((resolve, reject) => {
      if (this.platform.is('cordova')) {
        if (this.emailAddress == undefined) {
          this.retrieveUserData().then(() => {
            resolve(this.emailAddress);
          });
        }
        else {
          resolve(this.emailAddress);
        }
      }
    });

  }

  public SetEmailAddress(value: string) {
    this.emailAddress = value;
  }

  public GetPictureUrl(): Promise<any> {

    return new Promise((resolve, reject) => {
      if (this.platform.is('cordova')) {
        if (this.pictureUrl == undefined) {
          this.retrieveUserData().then(() => {
            resolve(this.pictureUrl);
          });
        }
        else {
          resolve(this.pictureUrl);
        }
      }
    });

  }

  public GetFirstName(): Promise<any> {
    return new Promise((resolve, reject) => {

      if (this.platform.is('cordova')) {
        if (this.firstName == undefined) {
          this.retrieveUserData().then(() => {
            resolve(this.firstName);
          });
        }
        else {
          resolve(this.firstName);
        }
      }
    });

  }

  public GetLastName(): Promise<any> {

    return new Promise((resolve, reject) => {
      if (this.platform.is('cordova')) {
        if (this.lastName == undefined) {
          this.retrieveUserData().then(() => {
            resolve(this.lastName);
          });
        }
        else {
          resolve(this.lastName);
        }
      }
    });

  }

  public GetId(): Promise<any> {

    return new Promise((resolve, reject) => {
      if (this.platform.is('cordova')) {
        if (this.id == undefined) {
          this.retrieveUserData().then(() => {
            resolve(this.id);
          });
        }
        else {
          resolve(this.id);
        }
      }
    });

  }

  public GetJobTitle(): Promise<any> {
    return new Promise((resolve, reject) => {

      if (this.platform.is('cordova')) {
        if (this.jobTitle == undefined) {
          this.retrieveUserData().then(() => {
            resolve(this.jobTitle);
          });
        }
        else {
          resolve(this.jobTitle);
        }
      }
    });

  }

  public GetLocation(): Promise<any> {
    return new Promise((resolve, reject) => {

      if (this.platform.is('cordova')) {
        if (this.location == undefined) {
          this.retrieveUserData().then(() => {
            resolve(this.location);
          });
        }
        else {
          resolve(this.location);
        }
      }
    });

  }

  public GetNumConnections(): Promise<any> {
    return new Promise((resolve, reject) => {

      if (this.platform.is('cordova')) {
        if (this.numConnections == undefined) {
          this.retrieveUserData().then(() => {
            resolve(this.numConnections);
          });
        }
        else {
          resolve(this.numConnections);
        }
      }
    });

  }
}
