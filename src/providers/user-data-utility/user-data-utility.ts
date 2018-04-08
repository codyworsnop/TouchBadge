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
        'awsToken': this.AWSToken
      };

      this.storage.set('userProfile', userData).then(() => {
        resolve();
      });
    });
  }

  private retrieveUserData(): Promise<any> {

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

        resolve();
      }).catch((error) => {

        console.log("Error retrieving data: " + error);
        reject(error);
      });
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
      if (this.AWSToken == undefined) {
        this.retrieveUserData().then(() => {
          resolve(this.AWSToken);
        });
      }
      else {
        resolve(this.AWSToken);
      }
    });
  }

  public GetAWSIdentityId(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.AWSIdentityId == undefined) {
        this.retrieveUserData().then(() => {
          resolve(this.AWSIdentityId);
        });
      }
      else {
        resolve(this.AWSIdentityId);
      }
    });
  }

  public GetEmailAddress(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.emailAddress == undefined) {
        this.retrieveUserData().then(() => {
          resolve(this.emailAddress);
        });
      }
      else { 
        resolve(this.emailAddress);
      }
    });
  }

  public SetEmailAddress(value: string) {
    this.emailAddress = value;
  }

  public GetPictureUrl(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.pictureUrl == undefined) {
        this.retrieveUserData().then(() => {
          resolve(this.pictureUrl);
        });
      }
      else {
        resolve(this.pictureUrl);
      }
    });
  }

  public GetFirstName(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.firstName == undefined) {
        this.retrieveUserData().then(() => {
          resolve(this.firstName);
        });
      }
      else {
        resolve(this.firstName);
      }
    });
  }

  public GetLastName(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.lastName == undefined) {
        this.retrieveUserData().then(() => {
          resolve(this.lastName);
        });
      }
      else {
        resolve(this.lastName);
      }
    });
  }

  public GetId(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.id == undefined) {
        this.retrieveUserData().then(() => {
          resolve(this.id);
        });
      }
      else {
        resolve(this.id);
      }
    });
  }

  public GetJobTitle(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.jobTitle == undefined) {
        this.retrieveUserData().then(() => {
          resolve(this.jobTitle);
        });
      }
      else {
        resolve(this.jobTitle);
      }
    });
  }

  public GetLocation(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.location == undefined) {
        this.retrieveUserData().then(() => {
          resolve(this.location);
        });
      }
      else {
        resolve(this.location);
      }
    });
  }

  public GetNumConnections(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.numConnections == undefined) {
        this.retrieveUserData().then(() => {
          resolve(this.numConnections);
        });
      }
      else {
        resolve(this.numConnections);
      }
    });
  }
}
