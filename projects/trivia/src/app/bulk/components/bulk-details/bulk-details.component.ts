import { Component, Input, OnChanges, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { bulkState } from '../../store';
import { User, Category, Question, BulkUploadFileInfo } from '../../../../../../shared-library/src/lib/shared/model';
import { AppState, appState, categoryDictionary, getCategories, getTags } from '../../../store';
import * as bulkActions from '../../store/actions';

@Component({
  selector: 'bulk-details',
  templateUrl: './bulk-details.component.html',
  styleUrls: ['./bulk-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BulkDetailsComponent implements OnChanges, OnInit {

  categoryDictObs: Observable<{ [key: number]: Category }>;
  @Input() parsedQuestions: Array<Question>;
  @Input() showPaginator;
  questions: Question[];
  totalCount: number;
  user: User;

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
    this.store.select(appState.coreState).pipe(take(1)).subscribe(s => this.user = s.user);
    this.categoriesObs = this.store.select(getCategories);
    this.tagsObs = this.store.select(getTags);
  }


}


