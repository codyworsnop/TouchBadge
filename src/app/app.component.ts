import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';
import { IntroPage } from '../pages/intro/intro';
import { TabsPage } from '../pages/tabs/tabs';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  rootPage: any = TabsPage;
  loader: any;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, public storage: Storage) {

    platform.ready().then(() => {

      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.

      this.presentIntro();

      statusBar.styleDefault();
      splashScreen.hide();

    });
  }

  presentIntro() {
    this.storage.get('introShown').then((result) => {

      if (result) {
        this.rootPage = TabsPage;
      }
      else {
        this.rootPage = IntroPage;
        this.storage.set('introShown', true);
      }    
    });

  }
}

