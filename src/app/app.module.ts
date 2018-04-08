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
import { eventMap } from '../modals/eventMap/eventMap';
import { AuthService, AuthServiceProvider } from "./auth.service";
import { ProjectStore, ProjectStoreProvider } from "./project.store";
import { TaskStore, TaskStoreProvider } from "./task.store";
import { Sigv4Http, Sigv4HttpProvider } from "./sigv4.service";
import { AwsConfig } from "./app.config";

import { BLE } from '@ionic-native/ble'
import { HTTP } from '@ionic-native/http';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { LinkedInUtilityProvider } from '../providers/linked-in-utility/linked-in-utility';
import { UserDataUtilityProvider } from '../providers/user-data-utility/user-data-utility';
import { DynamoDB } from '../providers/aws.dynamodb'
import { LoggingUtilityProvider } from '../providers/logging-utility/logging-utility';
import { BluetoothUtilityProvider } from '../providers/bluetooth-utility/bluetooth-utility';
import { Geolocation } from '@ionic-native/geolocation';
import { Shake } from '@ionic-native/shake';

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
    newContactModal,
    eventMap,
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
    eventMap,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    AuthService, AuthServiceProvider,
    ProjectStore, ProjectStoreProvider,
    TaskStore, TaskStoreProvider,
    Sigv4Http, Sigv4HttpProvider,
    BLE,
    LinkedInUtilityProvider,
    HTTP,
    InAppBrowser,
    UserDataUtilityProvider,
    DynamoDB,
    LoggingUtilityProvider,
    BluetoothUtilityProvider,
    Geolocation,
    Shake,
  ]
})
export class AppModule {}
