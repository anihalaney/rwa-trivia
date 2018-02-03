import { Component, Input, Output, OnInit, OnDestroy, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

import { AppStore } from '../../core/store/app-store';
import { User, Category } from '../../model';

@Component({
  selector: 'matrix',
  templateUrl: './matrix.component.html',
  styleUrls: ['./matrix.component.scss']
})
export class MatrixComponent implements OnInit, OnDestroy {
  categoriesObs: Observable<Category[]>;
  tagsObs: Observable<string[]>;
  
  constructor(private store: Store<AppStore>,
              private router: Router) {
  }

  ngOnInit() {
    this.categoriesObs = this.store.select(s => s.categories);
    this.tagsObs = this.store.select(s => s.tags);
  }

  ngOnDestroy() {
  }

}
