import { Injectable } from '@angular/core';
import { ToastController } from 'ionic-angular';
import { UserDataUtilityProvider } from './user-data-utility/user-data-utility';

declare var AWS: any;
declare const aws_cognito_region;
declare const aws_cognito_identity_pool_id;
//declare const aws_user_pools_id;
//declare const aws_user_pools_web_client_id;

@Injectable()
export class DynamoDB {

  private documentClient: any;


  constructor(private toastCtrl: ToastController, private userData: UserDataUtilityProvider) {


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

  AddContactToDynamo(contact: any[]) {


    console.log(JSON.stringify(contact));
    const params = {
      'TableName': "Users",
      'Key': { UserID: "us-west-2:f3b94a53-7ee6-4f06-b927-9ac4940ebc8b" },        
      UpdateExpression: "set #contact = list_append(#contact, :contact)",
      ExpressionAttributeNames: {

        "#contact": "Contact",
      },
      ExpressionAttributeValues: { 

        ":contact": contact
      },

      ReturnValues: "UPDATED_NEW"
    };

    this.getDocumentClient().then(client => {

        client.update(params, (err, data) => { 

          if (err)
          {
            console.log("error: " + err)
          }
          else 
          {
            console.log("data: " + JSON.stringify(data));
          }
        });

      }).catch(err => {

        console.log(err);
        this.alertUser(err);
      });

  }

  getDocumentClient(): Promise<any> {

    return new Promise((resolve, reject) => {

      if (this.documentClient == null) {

        this.SetupAWSConfig().then(response => {
          resolve(this.documentClient);
        });
      }
      resolve(this.documentClient);

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
