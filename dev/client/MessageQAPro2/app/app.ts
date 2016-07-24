import {Component} from '@angular/core';
import {Platform, ionicBootstrap} from 'ionic-angular';
import {Http, Headers} from '@angular/http';
import {StatusBar} from 'ionic-native';
import {TabsPage} from './pages/tabs/tabs';
import {QuestionService} from './services/questions';

@Component({
  template: '<ion-nav [root]="rootPage"></ion-nav>',
  providers: [QuestionService]
})

export class MyApp {
  private rootPage: any;

  constructor(private platform: Platform, public http: Http) {
    this.rootPage = TabsPage;
    this.http = http;
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
    });
  }
}

ionicBootstrap(MyApp);
