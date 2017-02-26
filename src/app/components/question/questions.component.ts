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
  @Input() questions: Question[];
  @Input() categoryDictionary: {[key: number]: Category};

  constructor() {
  }

  ngOnInit() {
  }

  ngOnDestroy() {
  }

}
