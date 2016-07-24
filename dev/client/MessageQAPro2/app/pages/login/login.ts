import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {QuestionService} from '../../services/questions';
import {MyQuestionsPage} from '../myquestions/myquestions';
import {Loading} from 'ionic-angular';
@Component({
  templateUrl: 'build/pages/login/login.html'
})
export class LoginPage {
  email: String;
  password: String;
  constructor(private nav: NavController, public questionService: QuestionService) {
    this.nav = nav;
    this.email = '';
    this.password = '';
    this.questionService = questionService;
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
        let data = this.questionService.signin({
            email: email,
            password: password
        });
        this.questionService.setTherapistToken(email); // create a session kind of thing on the client side
        //console.log("ID:", data['tid']);
        this.questionService.setTherapistID(data['tid']);
    }
}
