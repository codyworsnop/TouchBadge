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
      IdentityId: "us-west-2:1e32272d-12b2-412e-82d7-f5236d082250",
      Logins: {
        'cognito-identity.amazonaws.com': 'eyJraWQiOiJ1cy13ZXN0LTIxIiwidHlwIjoiSldTIiwiYWxnIjoiUlM1MTIifQ.eyJzdWIiOiJ1cy13ZXN0LTI6MWUzMjI3MmQtMTJiMi00MTJlLTgyZDctZjUyMzZkMDgyMjUwIiwiYXVkIjoidXMtd2VzdC0yOjY3YjdjYTVlLTUzYTQtNGMzMS04ZDQ4LTEzNzZkZDMxYTgxOSIsImFtciI6WyJhdXRoZW50aWNhdGVkIiwibG9naW4ubW9qYW5nbGVzLnRvdWNoYmFkZ2UiLCJsb2dpbi5tb2phbmdsZXMudG91Y2hiYWRnZTp1cy13ZXN0LTI6NjdiN2NhNWUtNTNhNC00YzMxLThkNDgtMTM3NmRkMzFhODE5OmhlbHAiXSwiaXNzIjoiaHR0cHM6Ly9jb2duaXRvLWlkZW50aXR5LmFtYXpvbmF3cy5jb20iLCJleHAiOjE1MjE2NTkxNTYsImlhdCI6MTUyMTY1ODg1Nn0.C3O66DErJQoPkhty8UbeSrh_Kq2eI1HkDz-24IBOftDYxe3w_Wld66Ln3Q7b86VgEkVBxH__RCrxGV4eS93okQLYtN9S_Hr8rcTR3BxFDPYjydov73djOU6wwYjf3x8Ikq-ze5jV_yX_gJr5L2SLAT_BPGCkCT1AEv-vVPIAPxFKQd30DS-_U1YzKN6JQWTNPpZD6U7IRObgucrvoxTB12SB91MwDp8fff-mxpkNtlX29P6PAlSGXai2e65QeoaNtiHsuLkGCrjKZ02_SX0Vcxo3EM204qzfJ8KdJanGHYr0pVtim6-bYo6omsMvV101yH5j48sJIEJd24lqbeEdlg'
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
    this.alertUser("doc cl: " + this.documentClient);
  }

  getDocumentClient() : Promise<any> {

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
