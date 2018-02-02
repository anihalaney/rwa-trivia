import { Component, Input, OnChanges, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { PageEvent } from '@angular/material';
import { AppStore } from '../../../core/store/app-store';
import { User, Category, SearchResults, Question } from '../../../model';
import { DataSource } from '@angular/cdk/table';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Component({
  selector: 'bulk-details',
  templateUrl: './bulk-details.component.html',
  styleUrls: ['./bulk-details.component.scss']
})
export class BulkDetailsComponent implements OnInit, OnChanges, OnDestroy {

  categoryDictObs: Observable<{ [key: number]: Category }>;
  @Input() parsedQuestions: Array<Question>;
  questions: Question[];
  totalCount: number;


  constructor(private store: Store<AppStore>,
    private router: Router) {
    this.categoryDictObs = store.select(s => s.categoryDictionary);
  }

  ngOnInit() {
  }

  ngOnDestroy() {
  }

  ngOnChanges() {
    if (this.parsedQuestions) {
      this.totalCount = this.parsedQuestions.length;
    }

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


