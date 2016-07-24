import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {QuestionService} from '../../services/questions';
import {TimeAgoPipe, CalendarPipe, DateFormatPipe} from 'angular2-moment';
@Component({
  templateUrl: 'build/pages/answer/answer.html',
  pipes: [TimeAgoPipe]
})
export class AnswerPage {
  question: any;
  constructor(private params: NavParams) {
    this.question = this.params.get('q');
    console.log(this.question);
  }

}
