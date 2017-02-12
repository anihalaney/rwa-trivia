import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

import { AppStore } from '../../store/app-store';
import { Question, Category }     from '../../model';

@Component({
  selector: 'question-list',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.scss']
})
export class QuestionsComponent implements OnInit, OnDestroy {
  questionsObs: Observable<Question[]>;
  questions: Question[];
  categoryDictObs: Observable<{[key: number]: Category}>;
  categoryDictionary: {[key: number]: Category};
  sub: any;
  sub2: any;

  constructor(private store: Store<AppStore>) {
    this.questionsObs = store.select(s => s.questions);
    this.categoryDictObs = store.select(s => s.categoryDictionary);
  }

  ngOnInit() {
    this.sub = this.questionsObs.subscribe(questions => this.questions = questions);
    this.sub2 = this.categoryDictObs.subscribe(cd => this.categoryDictionary = cd);
  }

  ngOnDestroy() {
    if (this.sub)
      this.sub.unsubscribe();
    if (this.sub2)
      this.sub2.unsubscribe();
  }

}
