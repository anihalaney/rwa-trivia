import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { PageEvent } from '@angular/material';
import { AppStore } from '../../../core/store/app-store';
import { User, Category, SearchResults } from '../../../model';

@Component({
  selector: 'bulk-details',
  templateUrl: './bulk-details.component.html',
  styleUrls: ['./bulk-details.component.scss']
})
export class BulkDetailsComponent implements OnInit, OnDestroy {

  categoryDictObs: Observable<{ [key: number]: Category }>;
  @Input() questionsSearchResultsObs: SearchResults;

  constructor(private store: Store<AppStore>,
    private router: Router) {
    this.categoryDictObs = store.select(s => s.categoryDictionary);
  }

  ngOnInit() {
  }

  ngOnDestroy() {
  }


  pageChanged(pageEvent: PageEvent) {

  }
  categoryChanged(event: { categoryId: number, added: boolean }) {

  }
  tagChanged(event: { tag: string, added: boolean }) {

  }
  sortOrderChanged(sortOrder: string) {

  }
}
