import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';
import { IntroPage } from '../pages/intro/intro';
import { TabsPage } from '../pages/tabs/tabs';
import { Shake } from '@ionic-native/shake';
import { Vibration } from '@ionic-native/vibration';
import { HTTP } from '@ionic-native/http';
import { UserDataUtilityProvider } from '../providers/user-data-utility/user-data-utility';
import { Geolocation } from '@ionic-native/geolocation';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  rootPage: any = TabsPage;
  loader: any;

  bumpAPIEndpoint = "https://8fis1kghzf.execute-api.us-west-2.amazonaws.com/NewBumpEventProduction/WriteBump";

  constructor(private platform: Platform,
    private statusBar: StatusBar,
    private splashScreen: SplashScreen,
    private storage: Storage,
    private shake: Shake,
    private vibration: Vibration,
    private http: HTTP,
    private userData: UserDataUtilityProvider,
    private geolocation: Geolocation) {

    platform.ready().then(() => {

      this.presentIntro();

      statusBar.styleDefault();
      splashScreen.hide();

      //setup shake gesture
      const watch = this.shake.startWatch().subscribe(() => {
         this.shakeGestureHandler();
      });
    });
  }

  shakeGestureHandler() {
    console.log("shaked! from home :D");

    this.userData.GetAWSIdentityId().then((AWSID) => {
      this.GetLocation().then((coordinates) => {

        this.vibration.vibrate(1000);
        console.log("ID: " + AWSID + "lat, long: " + coordinates.latitude + ", " + coordinates.longitude);
        this.http.get(this.bumpAPIEndpoint + "?userID=" + AWSID + "&lat=" + coordinates.latitude + "&long=" + coordinates.longitude, {}, {}).then((response) => {
          console.log("api bump call: " + JSON.stringify(response));
          //this.vibration.vibrate(1000);
        }).catch((error) => {
          console.log("error sending: " + JSON.stringify(error));
        });
      });
    });
  }

  GetLocation(): Promise<any> {

    return new Promise((resolve, reject) => {
      this.geolocation.getCurrentPosition().then((resp) => {

        console.log("Lat: " + resp.coords.latitude + " Long: " + resp.coords.longitude);
        resolve(resp.coords);

      }).catch((error) => {
        console.log('Error getting location', error);
      });
    });
  }

  presentIntro() {
    this.storage.get('introShown').then((result) => {

      console.log("Has seen intro?: " + result);
      if (result) {
        this.rootPage = IntroPage;
      }
      else {
        this.rootPage = IntroPage;
        this.storage.set('introShown', true);
      }
    });
  }


}

