import { Component, Input, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

import { AppStore } from '../../../core/store/app-store';
import { QuestionActions } from '../../../core/store/actions';
import { User, Question, QuestionStatus, Category }     from '../../../model';

@Component({
  selector: 'my-questions',
  templateUrl: './my-questions.component.html',
  styleUrls: ['./my-questions.component.scss']
})
export class MyQuestionsComponent implements OnInit, OnDestroy {
  questionsObs: Observable<Question[]>;
  categoryDictObs: Observable<{[key: number]: Category}>;
  user: User;

  publishedQuestions: Question[];
  unpublishedQuestions: Question[];
  
  constructor(private store: Store<AppStore>,
              private questionActions: QuestionActions) {
    this.questionsObs = store.select(s => s.userQuestions);
    this.categoryDictObs = store.select(s => s.categoryDictionary);
    
    this.questionsObs.subscribe((userQuestions: Question[]) => {
      this.publishedQuestions = userQuestions.filter(q => q.status === QuestionStatus.APPROVED);
      this.unpublishedQuestions = userQuestions.filter(q => q.status !== QuestionStatus.APPROVED);
    })
  }

  ngOnInit() {
    this.store.take(1).subscribe(s => this.user = s.user);
    this.store.dispatch(this.questionActions.loadUserQuestions(this.user));
  }

  ngOnDestroy() {
  }

}
