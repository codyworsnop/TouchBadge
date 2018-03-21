import { Injectable } from '@angular/core';
import { Config } from 'ionic-angular';
import { ToastController } from 'ionic-angular';

declare var AWS: any;
declare const aws_cognito_region;
declare const aws_cognito_identity_pool_id;
declare const aws_user_pools_id;
declare const aws_user_pools_web_client_id;

@Injectable()
export class DynamoDB {

  private documentClient: any;


  constructor(private config: Config, private toastCtrl: ToastController) {


    AWS.config.region = aws_cognito_region;
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
      IdentityPoolId: aws_cognito_identity_pool_id,
      IdentityId: "us-west-2:41f62655-8ea0-4897-940b-8596bebd5dba",
      Logins: {
        'cognito-identity.amazonaws.com': 'eyJraWQiOiJ1cy13ZXN0LTIxIiwidHlwIjoiSldTIiwiYWxnIjoiUlM1MTIifQ.eyJzdWIiOiJ1cy13ZXN0LTI6NDFmNjI2NTUtOGVhMC00ODk3LTk0MGItODU5NmJlYmQ1ZGJhIiwiYXVkIjoidXMtd2VzdC0yOjY3YjdjYTVlLTUzYTQtNGMzMS04ZDQ4LTEzNzZkZDMxYTgxOSIsImFtciI6WyJhdXRoZW50aWNhdGVkIiwibG9naW4ubW9qYW5nbGVzLnRvdWNoYmFkZ2UiLCJsb2dpbi5tb2phbmdsZXMudG91Y2hiYWRnZTp1cy13ZXN0LTI6NjdiN2NhNWUtNTNhNC00YzMxLThkNDgtMTM3NmRkMzFhODE5OmNvZHkiXSwiaXNzIjoiaHR0cHM6Ly9jb2duaXRvLWlkZW50aXR5LmFtYXpvbmF3cy5jb20iLCJleHAiOjE1MjE2NzQ4NjgsImlhdCI6MTUyMTY3NDU2OH0.CJvsUtaSbg2k-YBCW6BXldmTOr2u7Yw4iK3x6rZtaV_an4wBfF7SX-HJJ8lA1zpKFdrdyc476IzYxEO2WfJL-TyTV95or_A36uPAKILJacQYCXrP_OC2HIWEaDeZXEpChqGvSFILtDjUYgucVrpnzuyaT826dJeCSkkC60JgbWwatAgP4ob9X7SJz7_TE15C1KGzTdskVcb2dJSppkibDcvdWJy411WaCaEhz7pOHEWYJclTweUIq5wLKoRBNt7lzCJiU6HjksIapDZsKQENllisKkLxJBO5kvOlT8vPjaKg5073evRkfq9g_REV_F4ZkOPpVlRiGNGX7xeAgEQgYQ'
      }
    });

    //AWS.config.update({customUserAgent: AWS.config.customUserAgent});


    /*
        const identityParams = {
          IdentityId: "us-west-2:2cd6c8f4-9c24-49fa-8a87-c32ce386de6d",
          Logins: {
            'cognito-identity.amazonaws.com': 'eyJraWQiOiJ1cy13ZXN0LTIxIiwidHlwIjoiSldTIiwiYWxnIjoiUlM1MTIifQ.eyJzdWIiOiJ1cy13ZXN0LTI6MmNkNmM4ZjQtOWMyNC00OWZhLThhODctYzMyY2UzODZkZTZkIiwiYXVkIjoidXMtd2VzdC0yOjY3YjdjYTVlLTUzYTQtNGMzMS04ZDQ4LTEzNzZkZDMxYTgxOSIsImFtciI6WyJhdXRoZW50aWNhdGVkIiwibG9naW4ubW9qYW5nbGVzLnRvdWNoYmFkZ2UiLCJsb2dpbi5tb2phbmdsZXMudG91Y2hiYWRnZTp1cy13ZXN0LTI6NjdiN2NhNWUtNTNhNC00YzMxLThkNDgtMTM3NmRkMzFhODE5OnNvbWVpZHRoaW5neSJdLCJpc3MiOiJodHRwczovL2NvZ25pdG8taWRlbnRpdHkuYW1hem9uYXdzLmNvbSIsImV4cCI6MTUyMTY1NjAzNiwiaWF0IjoxNTIxNjU1NzM2fQ.FZ15MaCAJA0cbvU3z7Mxep3tWly6yNV_wqLpivoQb5i4m7N0SQp1E_QT6uHLui4v1wCyGLXPc5TfvAjrRRnvieakCqk10OO5ScwGPM61Z7Fi4lOrx-XIbckBpGnc5IQd8kheqHhSQ0DAKYJfaggopQUDzXGua1Ol0KnsjLsKO5ojCA8d5aQyfCg4GJ6lR5NI_LHPX-EfMRzMCCQ7CbmYikMzT4K2WS6Nn0Js-y6fqKkU1cZVO7y0ZNhWxnEqLaUwlYAanq-Qw0kZxYmABkG4r5c0Na4nYS3_R8p5LQZqqdanPXVQRaOKc8r-24ujag60zqdJ-0nWX6-o4OPfZXT8TA'
         } 
        }
        AWS.config.region = aws_cognito_region;
        const identity = new AWS.CognitoIdentity();
    
        
        identity.getCredentialsForIdentity(identityParams, (err, data) => {
    
          if (err) {
            return console.error(err)
          }
          else 
          {
    
            console.log("setting cred");
            console.log(data);
            AWS.config.credentials = data;
          }
        });
        */

    // AWS.CognitoIdentityCredentials()

    AWS.config.credentials.refresh((error) => {
      if (error) {
        console.error(error);
      } else {
        // Instantiate aws sdk service objects now that the credentials have been updated.
        // example: var s3 = new AWS.S3();
        console.log('Successfully logged!');
      }
    });

    this.documentClient = new AWS.DynamoDB.DocumentClient();
    console.log("doc cl: " + this.documentClient);
  }

  getDocumentClient(): Promise<any> {

    return new Promise((resolve, reject) => {
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
