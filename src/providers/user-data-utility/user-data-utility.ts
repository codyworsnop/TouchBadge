import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { String } from 'aws-sdk/clients/cloudwatchevents';
import { LoggingUtilityProvider } from '../logging-utility/logging-utility';

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

  constructor(public storage: Storage, public logging: LoggingUtilityProvider) {

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

    this.saveUserData();
  }

  private saveUserData() {
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
    };

    this.storage.set('userProfile', userData);
  }

  private retrieveUserData() {

    this.logging.alertUser("outside: " + this.firstName);
    this.storage.get('userProfile').then((result) => {
      this.firstName = result.FirstName;
      this.lastName = result.LastName;
      this.jobTitle = result.JobTitle;
      this.location = result.Location;
      this.numConnections = result.numConnections;
      this.pictureUrl = result.pictureURL;
      this.emailAddress = result.emailAddress;

      this.logging.alertUser("inside: " + this.firstName);
    }).catch((error) => {

      console.log("Error retrieving data: " + error);

    });

    this.logging.alertUser("back out: " + this.firstName);
  }

  public SetAWSToken(value: string) {
    this.AWSToken = value;
  }

  public SetAWSIdentityId(value: string) {
    this.AWSIdentityId = value;
  }

  public GetAWSToken(): string {
    if (this.AWSToken != null) {
      return this.AWSToken;
    }
  }

  public GetAWSIdentityId(): string {
    if (this.AWSIdentityId != null) {
      return this.AWSIdentityId;
    }
  }

  public GetEmailAddress(): string {
    if (this.emailAddress == undefined) {
      //    this.retrieveUserData();
    }

    return this.emailAddress;
  }

  public SetEmailAddress(value: string) {
    this.emailAddress = value;
  }

  public GetPictureUrl(): string {
    if (this.pictureUrl == undefined) {
      //  this.retrieveUserData();
    }

    return this.pictureUrl;
  }

  public GetFirstName(): string {
    if (this.firstName == undefined) {
      this.retrieveUserData().then(() => {
        this.logging.alertUser("This worked?: " + this.firstName);
      });
    }
    this.logging.alertUser("This worked?adwawdw: " + this.firstName);
    return this.firstName;
  }

  public GetLastName(): string {
    if (this.lastName == undefined) {
      // this.retrieveUserData();
    }

    return this.lastName;
  }

  public GetId(): string {
    if (this.id == undefined) {
      //this.retrieveUserData();
    }

    return this.id;
  }

  public GetJobTitle(): string {
    if (this.jobTitle == undefined) {
      // this.retrieveUserData();
    }

    return this.jobTitle;
  }

  public GetLocation(): string {
    if (this.location == undefined) {
      //this.retrieveUserData();
    }

    return this.location;
  }

  public GetNumConnections(): number {

    if (this.numConnections == undefined) {
      // this.retrieveUserData();
    }

    return this.numConnections;
  }
}
