import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from './store';
import { ApplicationSettingsActions, CategoryActions, TopicActions } from 'shared-library/core/store/actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'trivia-editor';

  constructor(private store: Store<AppState>,
    private applicationSettingsAction: ApplicationSettingsActions,
    private categoryActions: CategoryActions,
    private topicsActions: TopicActions,
  ) {
    this.store.dispatch(this.applicationSettingsAction.loadApplicationSettings());
    this.store.dispatch(this.categoryActions.loadCategories());
    this.store.dispatch(this.topicsActions.loadTopTopics());

  }
}
