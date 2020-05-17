import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { skip, take } from 'rxjs/operators';
import { AppState, appState } from '../../store';
import { AuthenticationProvider } from 'shared-library/core/auth';
import { User } from 'shared-library/shared/model';
import { AutoUnsubscribe } from 'shared-library/shared/decorators';
import { ApplicationSettingsActions } from 'shared-library/core/store/actions';
import { CategoryActions } from 'shared-library/core/store/actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

@AutoUnsubscribe({ 'arrayName': 'subscriptions' })
export class AppComponent implements OnInit, OnDestroy {
  title = 'trivia!';
  user: User;
  subscriptions = [];

  theme = '';
  constructor(private renderer: Renderer2,
    private authService: AuthenticationProvider,
    private store: Store<AppState>,
    public router: Router,
    private applicationSettingsAction: ApplicationSettingsActions,
    private categoryActions: CategoryActions
  ) {

    this.store.dispatch(this.categoryActions.loadCategories());

    this.store.dispatch(this.applicationSettingsAction.loadApplicationSettings());
    this.subscriptions.push(store.select(appState.coreState).pipe(select(s => s.user), skip(1)).subscribe(user => {
      this.user = user;
      if (user) {
        let url: string;
        this.store.select(appState.coreState).pipe(take(1)).subscribe(s => url = s.loginRedirectUrl);
        if (url) {
          this.router.navigate([url]);
        }
      } else {
        // if user logs out then redirect to home page
        this.router.navigate(['/']);
      }
    }));

  }

  ngOnInit() {

  }

  ngOnDestroy() {

  }

  login() {
    this.authService.ensureLogin();
  }

  logout() {
    this.authService.logout();
    location.reload();
  }

  toggleTheme() {
    if (this.theme === '') {
      this.theme = 'dark';
      this.renderer.addClass(document.body, this.theme);
    } else {
      this.renderer.removeClass(document.body, this.theme);
      this.theme = '';
    }
  }
}
