import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

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

  constructor(public storage: Storage) {

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

    this.storage.set('userprofile', userData);
  }

  private retrieveUserData() {
    this.storage.get('userProfile').then((result) => {
      this.firstName = result.FirstName;
      this.lastName = result.LastName;
      this.jobTitle = result.JobTitle;
      this.location = result.Location;
      this.numConnections = result.numConnections;
      this.pictureUrl = result.pictureURL;
      this.emailAddress = result.emailAddress;
    }).catch((error) => {

      console.log("Error retrieving data: " + error);

    });
  }

  public SetAWSToken(value: string) {
    this.AWSToken = value;
  }

  public SetAWSIdentityId(value: string) {
    this.AWSIdentityId = value;
  }

  public GetAWSToken() {
    if (this.AWSToken == null) {
      return this.AWSToken;
    }
  }

  public GetAWSIdentityId() {
    if (this.AWSIdentityId != null) {
      return this.AWSIdentityId;
    }
  }

  public GetEmailAddress() {
    if (this.emailAddress == null) {
      this.retrieveUserData();
    }

    return this.emailAddress;
  }

  public SetEmailAddress(value: string) {
    this.emailAddress = value;
  }

  public GetPictureUrl() {
    if (this.pictureUrl == null) {
      this.retrieveUserData();
    }

    return this.pictureUrl;
  }

  public GetFirstName() {
    if (this.firstName == null) {
      this.retrieveUserData();
    }

    return this.firstName;
  }

  public GetLastName() {
    if (this.lastName == null) {
      this.retrieveUserData();
    }

    return this.lastName;
  }

  public GetId() {
    if (this.id == null) {
      this.retrieveUserData();
    }

    return this.id;
  }

  public GetJobTitle() {
    if (this.jobTitle == null) {
      this.retrieveUserData();
    }

    return this.jobTitle;
  }

  public GetLocation() {
    if (this.location == null) {
      this.retrieveUserData();
    }

    return this.location;
  }

  public GetNumConnections() {

    if (this.numConnections == null) {
      this.retrieveUserData();
    }

    return this.numConnections;
  }
}
