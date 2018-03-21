
import { Injectable } from '@angular/core';

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

  constructor() {

  }

  public SetUserData(first: string, last: string, id: string, jobTitle: string, location: string, numConnections: number, pictureUrl: string) {

    // console.log("fn: " + first + ", ln: " + last + ", id: " + id + ", jobTitle: " + jobTitle + ", location: " + location + ", num: " + numConnections);
    this.firstName = first;
    this.lastName = last;
    this.jobTitle = jobTitle;
    this.location = location;
    this.numConnections = numConnections;
    this.pictureUrl = pictureUrl;

    this.id = id;
  }

  public GetPictureUrl()
  {
    if (this.pictureUrl != null) {
      return this.pictureUrl;
    }
  }

  public GetFirstName() {
    if (this.firstName != null) {
      return this.firstName;
    }
  }

  public GetLastName() {
    if (this.lastName != null) {
      return this.lastName;
    }
  }

  public GetId() {
    if (this.id != null) {
      return this.id;
    }
  }

  public GetJobTitle() {
    if (this.jobTitle != null) {
      return this.jobTitle;
    }
  }

  public GetLocation() {
    if (this.location != null) {
      return this.location;
    }
  }

  public GetNumConnections() {

    if (this.numConnections != null) {
      return this.numConnections;
    }
  }
}
