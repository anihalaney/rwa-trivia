import { Component, OnInit, OnDestroy, Renderer2, Inject } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { MatSnackBar } from '@angular/material';
import { Subscription } from 'rxjs';
import { map, skip, take, filter } from 'rxjs/operators';


import { CategoryActions, TagActions, QuestionActions, GameActions } from '../../../../../shared-library/src/lib/core/store';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';

import { User } from '../../../../../shared-library/src/lib/shared/model';
import { AuthenticationProvider } from '../../../../../shared-library/src/lib/core/auth';
import { Utils, WindowRef } from '../../../../../shared-library/src/lib/core/services';
import { AppState, appState } from '../../store';
import { Location } from '@angular/common';
import { userState } from '../../user/store';
import * as gameplayactions from '../../game-play/store/actions';
import * as userActions from '../../user/store/actions';


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
    private categoryActions: CategoryActions,
    private tagActions: TagActions,
    private questionActions: QuestionActions,
    private gameActions: GameActions,
    private store: Store<AppState>,
    public router: Router,
    public snackBar: MatSnackBar,
    private location: Location,
    private windowRef: WindowRef,
    @Inject(PLATFORM_ID) private platformId: Object) {

    this.sub = store.select(appState.coreState).pipe(select(s => s.questionSaveStatus)).subscribe((status) => {
      if (status === 'SUCCESS') {
        this.snackBar.open('Question saved!', '', { duration: 2000 });
      }
    });


    this.sub2 = store.select(appState.coreState).pipe(select(s => s.user), skip(1)).subscribe(user => {
      this.user = user
      if (user) {
        let url: string;
        this.store.select(appState.coreState).pipe(select(s => s.invitationToken)).subscribe(status => {
          if (status !== 'NONE') {
            this.store.dispatch(new userActions.MakeFriend({ token: status, email: this.user.email, userId: this.user.authState.uid }))
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

    this.sub3 = this.store.select(appState.gameplayState).pipe(select(s => s.newGameId), filter(g => g !== '')).subscribe(gameObj => {

      //  console.log("Navigating to game: " + gameObj['gameId']);
      this.router.navigate(['/game-play', gameObj['gameId']]);
      this.store.dispatch(new gameplayactions.ResetCurrentQuestion());
    });

    this.sub4 = this.store.select(userState).pipe(select(s => s.userProfileSaveStatus)).subscribe(status => {
      if (status === 'MAKE FRIEND SUCCESS') {
        this.router.navigate(['my/invite-friends']);
        this.snackBar.open('You become the friend!', '', { duration: 2000 });
      }
    });

    this.sub5 = store.select(appState.userState).pipe(select(s => s.questionSaveStatus)).subscribe((status) => {
      if (status === 'IN PROGRESS') {
        this.router.navigate(['/my/questions']);
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
    Utils.unsubscribe([this.sub, this.sub2, this.sub3, this.sub4, this.sub5]);
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
      this.renderer.addClass(document.body, this.theme)
    } else {
      this.renderer.removeClass(document.body, this.theme)
      this.theme = '';
    }
  }
}
