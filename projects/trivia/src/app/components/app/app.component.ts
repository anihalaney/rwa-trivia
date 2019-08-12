import { Component, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { NavigationEnd, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { CookieLawComponent } from 'angular2-cookie-law';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { filter, skip, take } from 'rxjs/operators';
import { AuthenticationProvider } from 'shared-library/core/auth';
import { Utils, WindowRef } from 'shared-library/core/services';
import { coreState } from 'shared-library/core/store';
import { User, UserStatus } from 'shared-library/shared/model';
import { ApplicationSettingsActions, UserActions, CategoryActions } from 'shared-library/core/store/actions';
import * as gamePlayActions from '../../game-play/store/actions';
import { AppState, appState } from '../../store';
import { interval, Subscription } from 'rxjs';

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
  intervalSubscription: Subscription;

  @ViewChild('cookieLaw', { static: true })
  private cookieLawEl: CookieLawComponent;

  constructor(private renderer: Renderer2,
    private authService: AuthenticationProvider,
    private store: Store<AppState>,
    public router: Router,
    public snackBar: MatSnackBar,
    private windowRef: WindowRef,
    private userAction: UserActions,
    private applicationSettingsAction: ApplicationSettingsActions,
    private categoryActions: CategoryActions) {

    this.store.dispatch(this.applicationSettingsAction.loadApplicationSettings());
    this.store.dispatch(this.categoryActions.loadCategories());

    this.subscriptions.push(store.select(appState.coreState).pipe(select(s => s.user), skip(1)).subscribe(user => {
      this.user = user;
      if (user) {
        let url: string;
        this.subscriptions.push(this.store.select(appState.coreState).pipe(select(s => s.invitationToken)).subscribe(status => {
          if (status !== 'NONE') {
            this.store.dispatch(this.userAction.makeFriend({ token: status, email: this.user.email, userId: this.user.authState.uid }));
          }
        }));
        this.subscriptions.push(this.store.select(appState.coreState).pipe(take(1)).subscribe(s => url = s.loginRedirectUrl));
        if (url) {
          this.router.navigate([url]);
        }

        this.intervalSubscription = interval(1000 * 60 * 1)
          .subscribe(val => {
            const userStatus: UserStatus = new UserStatus();
            userStatus.userId = this.user.userId;
            userStatus.online = true;
            userStatus.lastUpdated = new Date().getTime();
            this.authService.updateUserConnection();
            return val;
          });
        this.authService.updateUserConnection();
        this.subscriptions.push(this.intervalSubscription);

      } else {
        // user logs out then redirect to home page
        if (this.intervalSubscription) {
          this.intervalSubscription.unsubscribe();
        }
        this.router.navigate(['/']);
      }
    }));

    this.subscriptions.push(this.store.select(appState.coreState)
      .pipe(select(s => s.newGameId), filter(g => g !== '')).subscribe(gameObj => {
        this.router.navigate(['/game-play', gameObj['gameId']]);
        this.store.dispatch(new gamePlayActions.ResetCurrentQuestion());
      }));

    this.subscriptions.push(this.store.select(coreState).pipe(select(s => s.userProfileSaveStatus)).subscribe(status => {
      if (status === 'MAKE FRIEND SUCCESS') {
        this.router.navigate(['user/my/invite-friends']);
        this.snackBar.open('You become the friend!', '', { duration: 2000 });
      }
    }));

  }

  ngOnInit() {
    this.subscriptions.push(this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      if (this.windowRef && this.windowRef.nativeWindow) {
        this.windowRef.addNavigationsInAnalytics(evt);
        this.windowRef.scrollDown();
      }
    }));
  }

  ngOnDestroy() {

  }

  login() {
    this.authService.ensureLogin();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/dashboard']);
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
  cookiesAccepted() {
    this.cookieLawEl.dismiss();
  }
}
