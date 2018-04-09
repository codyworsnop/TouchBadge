import { Injectable } from '@angular/core';
import { ToastController } from 'ionic-angular';
import { UserDataUtilityProvider } from './user-data-utility/user-data-utility';
import { String } from 'aws-sdk/clients/rekognition';
import { CATCH_ERROR_VAR } from '@angular/compiler/src/output/output_ast';
import { StringAttributeValue } from 'aws-sdk/clients/dynamodbstreams';

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

    var awsIdentity: any;
    var awsToken: any;

    return new Promise((resolve, reject) => {

      this.userData.GetAWSIdentityId().then((response) => {
        awsIdentity = response;
      });

      this.userData.GetAWSToken().then((response) => {
        awsToken = response;
      });

      AWS.config.region = aws_cognito_region;
      AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: aws_cognito_identity_pool_id,
        IdentityId: awsIdentity,
        Logins: {
          'cognito-identity.amazonaws.com': awsToken
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

  RetrieveContactFromDynamo(userAWSID: string): Promise<any> {


    return new Promise((resolve, reject) => {

      this.getDocumentClient().then(client => {

        console.log("got client");

        const params = {
          TableName: 'Users',
          FilterExpression: "#id = :awsid",
          ExpressionAttributeNames: {
            '#id': 'UserID'
          },
          ExpressionAttributeValues: {
            ':awsid': userAWSID
          }
        };


        client.scan(params, (err, data) => {
          if (err) {
            console.log("Error retrieving user id data from db: " + err);
          }
          else {
            resolve(data);
          }
        });
      });
    });
  }

  AddContactToDynamo(contact: any[]) {

    console.log(JSON.stringify(contact));
    var awsToken: any;

    this.userData.GetAWSIdentityId().then((response) => {
      awsToken = response;

      this.alertUser("AWSTOK: " + awsToken);

      const params = {
        'TableName': "Users",
        'Key': { UserID: awsToken },
        UpdateExpression: "set #contact = list_append(#contact, :contact)",
        ExpressionAttributeNames: {

          "#contact": "Contacts",
        },
        ExpressionAttributeValues: {

          ":contact": contact
        },

        ReturnValues: "UPDATED_NEW"
      };

      this.getDocumentClient().then(client => {

        client.update(params, (err, data) => {

          if (err) {
            console.log("error: " + err)
          }
          else {
            console.log("data: " + JSON.stringify(data));
          }
        });

      }).catch(err => {

        console.log(err);
        this.alertUser(err);
      });
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
