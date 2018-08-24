import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';

import { AppState, appState, categoryDictionary } from '../../../store';

import { Category, SearchResults } from '../../../../../../shared-library/src/lib/shared/model';

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  categoriesObs: Observable<Category[]>;
  categoryDictObs: Observable<{ [key: number]: Category }>;
  tagsObs: Observable<string[]>;
  questionsSearchResultsObs: Observable<SearchResults>;

  constructor(private store: Store<AppState>
  ) {
    this.categoriesObs = store.select(appState.coreState).pipe(select(s => s.categories));
    this.categoryDictObs = store.select(categoryDictionary);
    this.tagsObs = store.select(appState.coreState).pipe(select(s => s.tags));
    this.questionsSearchResultsObs = store.select(appState.adminState).pipe(select(s => s.questionsSearchResults));
  }

  ngOnInit() {
  }

  ngOnDestroy() {
  }
}
