import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { MatSnackBar } from '@angular/material';
import { Subscription } from 'rxjs';
import { skip, take, filter } from 'rxjs/operators';
import { User } from 'shared-library/shared/model';
import { AuthenticationProvider } from 'shared-library/core/auth';
import { Utils, WindowRef } from 'shared-library/core/services';
import { AppState, appState } from '../../store';
import * as gamePlayActions from '../../game-play/store/actions';
import { UserActions, ApplicationSettingsActions } from 'shared-library/core/store/actions';
import { coreState } from 'shared-library/core/store';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'trivia!';
  user: User;
  sub: Subscription;
  sub2: Subscription;
  sub3: Subscription;
  sub4: Subscription;
  sub5: Subscription;

  theme = '';
  constructor(private renderer: Renderer2,
    private authService: AuthenticationProvider,
    private store: Store<AppState>,
    public router: Router,
    public snackBar: MatSnackBar,
    private windowRef: WindowRef,
    private userAction: UserActions,
    private applicationSettingsAction: ApplicationSettingsActions,
    private utils: Utils) {

    this.store.dispatch(this.applicationSettingsAction.loadApplicationSettings());

    this.sub2 = store.select(appState.coreState).pipe(select(s => s.user), skip(1)).subscribe(user => {
      this.user = user;
      if (user) {
        let url: string;
        this.store.select(appState.coreState).pipe(select(s => s.invitationToken)).subscribe(status => {
          if (status !== 'NONE') {
            this.store.dispatch(this.userAction.makeFriend({ token: status, email: this.user.email, userId: this.user.authState.uid }));
          }
        });
        this.store.select(appState.coreState).pipe(take(1)).subscribe(s => url = s.loginRedirectUrl);
        if (url) {
          this.router.navigate([url]);
        }

      } else {
        // if user logs out then redirect to home page
        this.router.navigate(['/']);
      }
    });

    this.sub3 = this.store.select(appState.coreState).pipe(select(s => s.newGameId), filter(g => g !== '')).subscribe(gameObj => {
      this.router.navigate(['/game-play', gameObj['gameId']]);
      this.store.dispatch(new gamePlayActions.ResetCurrentQuestion());
    });

    this.sub4 = this.store.select(coreState).pipe(select(s => s.userProfileSaveStatus)).subscribe(status => {
      if (status === 'MAKE FRIEND SUCCESS') {
        this.router.navigate(['my/invite-friends']);
        this.snackBar.open('You become the friend!', '', { duration: 2000 });
      }
    });

  }

  ngOnInit() {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      if (this.windowRef && this.windowRef.nativeWindow) {
        if (this.windowRef.nativeWindow.ga) {
          this.windowRef.nativeWindow.ga('set', 'page', evt.urlAfterRedirects);
          this.windowRef.nativeWindow.ga('send', 'pageview');
        }
        if (this.windowRef.nativeWindow.scrollTo) {
          this.windowRef.nativeWindow.scrollTo(0, 0);
        }
      }
    });
  }

  ngOnDestroy() {
    this.utils.unsubscribe([this.sub, this.sub2, this.sub3, this.sub4]);
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
}
