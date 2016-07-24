import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {QuestionService} from '../../services/questions';
import {MyQuestionsPage} from '../myquestions/myquestions';
import {Loading} from 'ionic-angular';
@Component({
  templateUrl: 'build/pages/account/account.html'
})
export class AccountPage {
  email: String;
  password: String;
  isLoggedIn: boolean;
  constructor(private nav: NavController, public questionService: QuestionService) {
    this.nav = nav;
    this.email = '';
    this.password = '';
    this.questionService = questionService;
    this.isLoggedIn = this.questionService.isTherapistSessionActive();
    console.log(this.isLoggedIn);
  }
  validateUser() {
        var email = this.email;
        var password = this.password;
        if(!email || !password) {
          let loading = Loading.create({
            content: "Please enter valid credentials",
            duration: 3000
          });
        	this.nav.present(loading);
        	return false;
        }
        this.questionService.signin({
            email: email,
            password: password
        }).then(data => {
          if (data){
            this.isLoggedIn = true;
            var body = JSON.parse((data as any)._body);
            this.questionService.setTherapistToken((body as any).email); // create a session kind of thing on the client side
            console.log((body as any).tid);
            this.questionService.setTherapistID((body as any).tid);
          }
        })


    }
}
