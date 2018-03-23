import { HTTP } from '@ionic-native/http';
import { Injectable } from '@angular/core';
import { Platform, LoadingController } from 'ionic-angular';
import { InAppBrowserOptions, InAppBrowser } from '@ionic-native/in-app-browser';
import { UserDataUtilityProvider } from '../user-data-utility/user-data-utility';
import { userInfo } from 'os';
import { ToastController } from 'ionic-angular/components/toast/toast-controller';


/*
  Generated class for the LinkedInUtilityProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LinkedInUtilityProvider {

  linkedinAuthURL: string = "https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=86vfexnhygt77x&redirect_uri=http%3A%2F%2Flocalhost%2Fcallback&state=987654321&scope=r_basicprofile%20r_emailaddress";
  apiGatewayURL: string = "https://eg7i5c3b4a.execute-api.us-west-2.amazonaws.com/LinkedinLoginAPIDeployStage/LinkedInLogin";

  constructor(public http: HTTP, public platform: Platform, public loadingCtrl: LoadingController, public iab: InAppBrowser, public userData: UserDataUtilityProvider, private toastCtrl: ToastController) {

  }

  public getAWSToken(): Promise<any> {

    return new Promise((resolve, reject) => {
      this.http.get("https://eg7i5c3b4a.execute-api.us-west-2.amazonaws.com/LinkedinLoginAPIDeployStage/LinkedInLogin" + "?id=" + this.userData.GetId(), {}, {}).then(response => {

        var result = JSON.parse(response.data);
        this.userData.SetAWSIdentityId(result.IdentityId);
        this.userData.SetAWSToken(result.Token);
        resolve();

      }, error => {

        this.alertUser("error: " + JSON.stringify(error));
        console.log("Error resolving aws token: " + error);
        reject();

      })
    });
  }
 
  public linkedInLogin(): Promise<any> {

    var loader = null;
    var data: Object = {};

    return new Promise((resolve, reject) => {

      this.platform.ready().then(() => {

        this.linkedInGetAuthCode().then(success => {

          console.log("auth code success!");

          let headers = {
            'Content-Type': 'application/x-www-form-urlencoded'
          };

          let body = {
            "grant_type": "authorization_code",
            "code": success.code,
            "redirect_uri": "http://localhost/callback",
            "client_id": "86vfexnhygt77x",
            "client_secret": "kIXIPJuZZLf1E64Y",
          };

          this.http.post("https://www.linkedin.com/oauth/v2/accessToken", body, headers).then(res => {

            let data = JSON.parse(res.data);
            console.log("token: " + data.access_token);

            if (data.access_token !== undefined) {

              let loader = this.loadingCtrl.create({
                content: "Logging in"

              });

              loader.present();

              this.getLinkedInUserDetails(data.access_token).then(response => {

                var result = JSON.parse(response.data);
                this.userData.SetUserData(result.firstName, result.lastName, result.id, result.positions.values[0].title, result.location.name, result.numConnections, result.pictureUrl, result.emailAddress);

              }).then(() => {

                this.getAWSToken().then((response) => { 

                  loader.dismiss();
                  resolve();

                }).catch((error) => {

                  loader.dismiss();
                  reject();

                });
              });
            }
          }, error => {

            console.log("error posting http request: " + JSON.stringify(error));
          });
        }, error => {
          console.log("error: " + error);
        });
      }, error => {
        console.log("error: " + error);
      });
    });
  }

  private getLinkedInUserDetails(token: string) {

    let headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Bearer ' + token,
    };

    return this.http.get("https://api.linkedin.com/v1/people/~:(id,first-name,last-name,email-address,picture-url,positions,location,num-connections)?format=json", {}, headers).then(response => response, error => error);
  }

  private linkedInGetAuthCode(): Promise<any> {

    var parsedResponse = {};

    return new Promise((resolve, reject) => {

      const options: InAppBrowserOptions = {
        zoom: 'no'
      }

      // Opening a URL and returning an InAppBrowserObject
      var browserRef = this.iab.create(this.linkedinAuthURL, '_blank', options);

      browserRef.on('loadstart').subscribe((event) => {

        if ((event.url).indexOf("http://localhost/callback") == 0) {

          browserRef.close();
          var code = (event.url.split("=")[1]).split("&")[0];
          var state = event.url.split("=")[2];

          if (code !== null && state !== null) {

            parsedResponse["code"] = code;
            parsedResponse["state"] = state;

            resolve(parsedResponse);

          } else {

            reject("Problem authenticating with LinkedIn");
          }

        }
      }, error => {
        console.log("error: " + error);
      });

      browserRef.on('exit').subscribe((event) => {
        this.alertUser("error: " + JSON.stringify(event));
        reject(event);
      });

      browserRef.on('loaderror').subscribe((event) => { 
        this.alertUser("error: " + JSON.stringify(event));
        reject(event);
      })
    });
  }

  alertUser(message: string) { 

    let toast = this.toastCtrl.create({
      message: message,
      showCloseButton: true,
      position: 'bottom',
    });

    toast.present();
  }
}