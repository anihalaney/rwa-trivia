import { Component } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { skip, take } from 'rxjs/operators';
import { AppState, appState } from './store';
import { AuthenticationProvider } from 'shared-library/core/auth';
import { User } from 'shared-library/shared/model';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { ApplicationSettingsActions } from 'shared-library/core/store/actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'trivia-editor';

  constructor(private store: Store<AppState>,
    private applicationSettingsAction: ApplicationSettingsActions, ) {
      (this.store.dispatch(this.applicationSettingsAction.loadApplicationSettings()));

  }
}
