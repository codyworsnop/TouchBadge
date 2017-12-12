import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { CalendarPage } from '../pages/calendar/calendar';
import { ContactPage } from '../pages/contact/contact';
import { ConfigurePage } from '../pages/configure/configure'
import { TabsPage } from '../pages/tabs/tabs';
import { IntroPage } from '../pages/intro/intro';
import { LoginModal } from '../modals/login/login';
import { ContactDetailPage } from '../pages/contactDetail/contactDetail';

import { CalendarModule } from "ion2-calendar";
import { newContactModal } from '../modals/newContact/newContact';
import { AuthService, AuthServiceProvider } from "./auth.service";
import { ProjectStore, ProjectStoreProvider } from "./project.store";
import { TaskStore, TaskStoreProvider } from "./task.store";
import { Sigv4Http, Sigv4HttpProvider } from "./sigv4.service";
import { AwsConfig } from "./app.config";

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    CalendarPage,
    ContactPage,
    ConfigurePage,
    TabsPage,
    IntroPage,
    LoginModal,
    ContactDetailPage,
    newContactModal
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp, new AwsConfig().load()),
    IonicStorageModule.forRoot(),
    CalendarModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    CalendarPage,
    ContactPage,
    ConfigurePage,
    TabsPage,
    IntroPage,
    LoginModal,
    ContactDetailPage,
    newContactModal,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthService, AuthServiceProvider,
    ProjectStore, ProjectStoreProvider,
    TaskStore, TaskStoreProvider,
    Sigv4Http, Sigv4HttpProvider
  ]
})
export class AppModule {}
