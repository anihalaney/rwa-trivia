import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

import { AppStore } from '../../store/app-store';
import { Question }     from '../../model';

@Component({
  selector: 'question-list',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.scss']
})
export class QuestionsComponent implements OnInit, OnDestroy {
  questionsObs: Observable<Question[]>;
  questions: Question[];
  sub: any;

  constructor(private store: Store<AppStore>) {
    this.questionsObs = store.select(s => s.questions);
  }

  ngOnInit() {
    this.sub = this.questionsObs.subscribe(questions => this.questions = questions);
  }

  ngOnDestroy() {
    if (this.sub)
      this.sub.unsubscribe();
  }

}
