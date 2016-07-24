import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {QuestionService} from '../../services/questions';
import {AnswerPage} from '../answer/answer';
import {TimeAgoPipe, CalendarPipe, DateFormatPipe} from 'angular2-moment';
@Component({
  templateUrl: 'build/pages/myquestions/myquestions.html',
  pipes: [TimeAgoPipe]
})
export class MyQuestionsPage {
  questions: any = [];
  isLoggedIn: boolean;
  constructor(private nav: NavController, public questionService: QuestionService) {
    this.nav = nav;
    this.questionService = questionService;
    this.isLoggedIn = this.questionService.isTherapistSessionActive();
  }
  getQuestions(refresher){
    var ID = this.questionService.getTherapistID();
    console.log(JSON.stringify(ID, null, 4));
    this.questionService.getTherapistAll(ID)
    .then(data => {
      this.questions = JSON.parse((data as any)._body);
      console.log(JSON.stringify(this.questions, null, 4));
      if (this.questions){
        refresher.complete();
      }
    });

  }
  answer(question){
    this.nav.push(AnswerPage, {q: question});
  }
}
