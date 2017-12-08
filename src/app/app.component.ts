import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { IntroPage } from '../pages/intro/intro';
import { TabsPage } from '../pages/tabs/tabs';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  rootPage:any = TabsPage;
  loader: any;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, public storage: Storage, public loadingCtrl: LoadingController) {

    this.presentLoading();

    platform.ready().then(() => {

      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.

      this.storage.get('introShown').then((result) => {

        console.log("Result output: ");
        console.log(result);
        if (result){
          this.rootPage = IntroPage;
        }
        else
        {
          this.rootPage = IntroPage;
          this.storage.set('introShown', true);
        }

        this.loader.dismiss();

      });

      statusBar.styleDefault();
      splashScreen.hide();
 
    });
  }

  presentLoading() {

    this.loader = this.loadingCtrl.create({
      content: "Authenticating..."
    });

    this.loader.present();
  }
}

