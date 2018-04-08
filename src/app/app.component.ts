import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';
import { IntroPage } from '../pages/intro/intro';
import { TabsPage } from '../pages/tabs/tabs';
import { Shake } from '@ionic-native/shake';
import { Vibration } from '@ionic-native/vibration';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  rootPage: any = TabsPage;
  loader: any;

  constructor(private platform: Platform, private statusBar: StatusBar, private splashScreen: SplashScreen, private storage: Storage, private shake: Shake, private vibration: Vibration) {

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

  presentIntro() {
    this.storage.get('introShown').then((result) => {

      console.log("Has seen intro?: " + result);
      if (result) {
        this.rootPage = TabsPage;
      }
      else {
        this.rootPage = IntroPage;
        this.storage.set('introShown', true);
      }
    });
  }

  shakeGestureHandler() {
    console.log("shaked! :D");
    this.vibration.vibrate(1000);
  }
}

