import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { MatSnackBar } from '@angular/material';
import { Subscription } from 'rxjs/Subscription';

import { AppState, appState } from '../../store';
import { CategoryActions, TagActions, QuestionActions, GameActions } from '../../core/store';
import { Utils } from '../../core/services';
import { AuthenticationProvider } from '../../core/auth';
import { User } from '../../model';
import { Location } from '@angular/common';
import { userState } from '../../user/store';
import * as userActions from '../../user/store/actions';
import { Meta } from '@angular/platform-browser';

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
    private meta: Meta) {

    this.meta.addTag({ property: 'og:title', content: 'Share Score' });
    this.meta.addTag({
      property: 'og:image',
      content: 'http://files.softicons.com/download/application-icons/free-large-torrent-icons-by-aha-soft/png/128x128/Linux.png'
    });
    this.meta.addTag({ property: 'og:description', content: 'Sharing my game score' });


    this.sub = store.select(appState.coreState).select(s => s.questionSaveStatus).subscribe((status) => {
      if (status === 'SUCCESS') {
        this.snackBar.open('Question saved!', '', { duration: 2000 });
      }
    });

    this.sub = store.select(appState.userState).select(s => s.questionSaveStatus).subscribe((status) => {
      if (status === 'IN PROGRESS') {
        this.router.navigate(['/my/questions', this.user.userId]);
      }
    });

    this.sub2 = store.select(appState.coreState).select(s => s.user).skip(1).subscribe(user => {
      this.user = user
      if (user) {
        let url: string;
        this.store.select(appState.coreState).select(s => s.invitationToken).subscribe(status => {
          if (status !== 'NONE') {
            this.store.dispatch(new userActions.MakeFriend({ token: status, email: this.user.email, userId: this.user.authState.uid }))
          }
        });
        this.store.select(appState.coreState).take(1).subscribe(s => url = s.loginRedirectUrl);
        if (url) {
          this.router.navigate([url]);
        }

      } else {
        // if user logs out then redirect to home page
        this.router.navigate(['/']);
      }
    });
  }

  ngOnInit() {

  }

  ngOnDestroy() {
    Utils.unsubscribe([this.sub, this.sub2]);
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
