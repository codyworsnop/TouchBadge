
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

  constructor() {

  }

  public SetUserData(first: string, last: string, id: string)
  {
    this.firstName = first;
    this.lastName = last; 
    this.id = id; 
  }

  public GetFirstName()
  {
    return this.firstName;
  }

  public GetLastName()
  {
    return this.lastName;
  }

  public GetId()
  {
    return this.id;
  }

  public GetJobTitle()
  {
    return this.jobTitle;
  }

}
