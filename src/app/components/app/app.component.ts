import { Component } from '@angular/core';
import { Store } from '@ngrx/store';

import { AppStore } from '../../store/app-store';
import { CategoryActions } from '../../store/actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'trivia!';
  constructor(private categoryActions: CategoryActions,
              private store: Store<AppStore>) {
  }

  ngOnInit () {
    this.store.dispatch(this.categoryActions.loadCategories());
  }

}
