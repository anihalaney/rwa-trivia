import { Component, Input, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { AppState, appState, categoryDictionary } from '../../../store';
import { User, Category, Question } from '../../../model';


@Component({
  selector: 'bulk-details',
  templateUrl: './bulk-details.component.html',
  styleUrls: ['./bulk-details.component.scss']
})
export class BulkDetailsComponent implements OnChanges {

  categoryDictObs: Observable<{ [key: number]: Category }>;
  @Input() parsedQuestions: Array<Question>;
  questions: Question[];
  totalCount: number;

  constructor(private store: Store<AppState>,
    private router: Router) {
    this.categoryDictObs = store.select(categoryDictionary);
  }

  ngOnChanges() {
    if (this.parsedQuestions) {
      this.totalCount = this.parsedQuestions.length;
    }
  }
}


