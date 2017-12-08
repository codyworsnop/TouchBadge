import { Component } from '@angular/core';

import { CalendarPage } from '../calendar/calendar';
import { ContactPage } from '../contact/contact';
import { HomePage } from '../home/home';
import { ConfigurePage } from '../configure/configure';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = ContactPage;
  tab3Root = CalendarPage;
  tab4Root = ConfigurePage;

  constructor() {

  }
}
