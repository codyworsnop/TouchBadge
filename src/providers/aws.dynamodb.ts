import { Injectable } from '@angular/core';
import { Config } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { UserDataUtilityProvider } from './user-data-utility/user-data-utility';

declare var AWS: any;
declare const aws_cognito_region;
declare const aws_cognito_identity_pool_id;
declare const aws_user_pools_id;
declare const aws_user_pools_web_client_id;

@Injectable()
export class DynamoDB {

  private documentClient: any;


  constructor(private config: Config, private toastCtrl: ToastController, private userData: UserDataUtilityProvider) {


  }

  private SetupAWSConfig(): Promise<any> {

    return new Promise((resolve, reject) => {

      AWS.config.region = aws_cognito_region;
      AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: aws_cognito_identity_pool_id,
        IdentityId: this.userData.GetAWSIdentityId(),
        Logins: {
          'cognito-identity.amazonaws.com': this.userData.GetAWSToken()
        }
      });

      AWS.config.credentials.refresh((error) => {
        if (error) {
          
          console.error(error);
        } else {

          console.log('Successfully logged!');
        }

      });

      this.documentClient = new AWS.DynamoDB.DocumentClient();
      resolve();

    });

  }

  getDocumentClient(): Promise<any> {

    return new Promise((resolve, reject) => {

      if (this.documentClient == null) {
        this.SetupAWSConfig().then(response => {
          resolve(this.documentClient);
        });
      }

    });
  }

  alertUser(message: string) {

    let toast = this.toastCtrl.create({
      message: message,
      showCloseButton: true,
      position: 'bottom'

    });

    toast.present();
  }

}
