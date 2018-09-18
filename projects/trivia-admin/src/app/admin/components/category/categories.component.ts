import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Store, select } from '@ngrx/store';

import { AppState, appState } from '../../../store';
import { Category } from '../../../../../../shared-library/src/lib/shared/model';

@Component({
  selector: 'category-list',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit, OnDestroy {
  categoriesObs: Observable<Category[]>;
  categories: Category[];
  sub: any;

  constructor(private store: Store<AppState>) {
    this.categoriesObs = store.select(appState.coreState).pipe(select(s => s.categories));
  }

  ngOnInit() {
    this.sub = this.categoriesObs.subscribe(categories => this.categories = categories);
  }

  ngOnDestroy() {
    if (this.sub)
      this.sub.unsubscribe();
  }
}
