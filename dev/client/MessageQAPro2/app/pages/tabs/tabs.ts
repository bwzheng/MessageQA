import {Component} from '@angular/core';
import {MyQuestionsPage} from '../myquestions/myquestions';
import {AccountPage} from '../account/account';
import {QuestionService} from '../../services/questions';
@Component({
  templateUrl: 'build/pages/tabs/tabs.html'
})
export class TabsPage {
  private tab1Root: any;
  private tab2Root: any;
  isLoggedIn: boolean;
  questionService: QuestionService;
  constructor(questionService: QuestionService) {
    // this tells the tabs component which Pages
    // should be each tab's root Page
    this.questionService = questionService;
    this.isLoggedIn = this.questionService.isSessionActive();
    console.log('t:', this.questionService.isSessionActive());
    this.tab1Root = MyQuestionsPage;
    this.tab2Root = AccountPage;

  }
}
