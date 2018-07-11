import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';

import { Store, select } from '@ngrx/store';

import { AppState, appState } from '../../../store';

@Component({
  selector: 'tag-list',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss']
})
export class TagsComponent implements OnInit, OnDestroy {
  tagsObs: Observable<string[]>;
  tags: string[];
  sub: any;

  constructor(private store: Store<AppState>) {
    this.tagsObs = store.select(appState.coreState).pipe(select(s => s.tags));
  }

  ngOnInit() {
    this.sub = this.tagsObs.subscribe(tags => this.tags = tags);
  }

  ngOnDestroy() {
    if (this.sub)
      this.sub.unsubscribe();
  }

}
