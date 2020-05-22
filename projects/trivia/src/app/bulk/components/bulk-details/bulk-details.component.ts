import { Component, Input, OnChanges, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { bulkState } from '../../store';
import { User, Category, Question, BulkUploadFileInfo } from 'shared-library/shared/model';
import { AppState, appState, categoryDictionary, getCategories, getTags } from '../../../store';
import * as bulkActions from '../../store/actions';
import { AutoUnsubscribe } from 'shared-library/shared/decorators';

@Component({
  selector: 'bulk-details',
  templateUrl: './bulk-details.component.html',
  styleUrls: ['./bulk-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

@AutoUnsubscribe({ 'arrayName': 'subscriptions' })
export class BulkDetailsComponent implements OnChanges, OnInit, OnDestroy {

  categoryDictObs: Observable<{ [key: number]: Category }>;
  @Input() parsedQuestions: Array<Question>;
  @Input() showPaginator;
  questions: Question[];
  totalCount: number;
  user: User;
  subscriptions = [];


  tagsObs: Observable<string[]>;
  categoriesObs: Observable<Category[]>;

  constructor(private store: Store<AppState>,
    private router: Router) {
    this.categoryDictObs = store.select(categoryDictionary);
  }

  ngOnChanges() {
    if (this.parsedQuestions) {
      this.totalCount = this.parsedQuestions.length;
    }
  }

  ngOnInit() {
    this.subscriptions.push(this.store.select(appState.coreState).pipe(take(1)).subscribe(s => this.user = s.user));
    this.categoriesObs = this.store.select(getCategories);
    this.tagsObs = this.store.select(getTags);
  }

  ngOnDestroy() {

  }

}


