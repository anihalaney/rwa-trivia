import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from './store';
import { ApplicationSettingsActions } from 'shared-library/core/store/actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'trivia-editor';

  constructor(private store: Store<AppState>,
    private applicationSettingsAction: ApplicationSettingsActions) {
    this.store.dispatch(this.applicationSettingsAction.loadApplicationSettings());

  }
}
