import { Component, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { AutoUnsubscribe } from 'shared-library/shared/decorators';
import { Observable } from 'rxjs';
import { AppState, appState } from '../../../store';



@Component({
  selector: 'tag-list',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss']
})
@AutoUnsubscribe()
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
  }
}
