import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { skip, take } from 'rxjs/operators';
import { AuthenticationProvider } from 'shared-library/core/auth';
import { User } from 'shared-library/shared/model';
import { AppState, appState } from '../../store';

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
    private location: Location,
  ) {



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
