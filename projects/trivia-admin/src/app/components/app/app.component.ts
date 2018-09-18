import { Component, OnInit, OnDestroy, Renderer2, Inject } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { map, skip, take, filter } from 'rxjs/operators';
import { AppState, appState } from '../../store';
import { Utils } from '../../../../../shared-library/src/lib/core/services';
import { AuthenticationProvider } from '../../../../../shared-library/src/lib/core/auth';
import { User } from '../../../../../shared-library/src/lib/shared/model';
import { Location } from '@angular/common';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'trivia!';
  user: User;
  sub: Subscription;


  theme = '';
  constructor(private renderer: Renderer2,
    private authService: AuthenticationProvider,
    private store: Store<AppState>,
    public router: Router,
    private location: Location) {



    this.sub = store.select(appState.coreState).pipe(select(s => s.user), skip(1)).subscribe(user => {
      this.user = user
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
    });

  }

  ngOnInit() {

  }

  ngOnDestroy() {
    Utils.unsubscribe([this.sub]);
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
