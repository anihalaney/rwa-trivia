import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { MdSnackBar } from '@angular/material';
import { Subscription } from 'rxjs/Subscription';

import { AppStore } from '../../core/store/app-store';
import { CategoryActions, TagActions, QuestionActions, GameActions } from '../../core/store/actions';
import { AuthenticationService, Utils } from '../../core/services';
import { User } from '../../model';

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

  constructor(
              private authService: AuthenticationService,
              private categoryActions: CategoryActions,
              private tagActions: TagActions,
              private questionActions: QuestionActions,
              private gameActions: GameActions,
              private store: Store<AppStore>,
              private router: Router,
              public snackBar: MdSnackBar) {
    this.sub = store.select(s => s.questionSaveStatus).subscribe((status) => {
      if (status === "SUCCESS")
        this.snackBar.open("Question saved!", "", {duration: 2000});
      if (status === "IN PROGRESS")
        this.router.navigate(['/my-questions']);
    })

    this.sub2 = store.select(s => s.user).skip(1).subscribe(user => {
      this.user = user
      if (user)
      {
        console.log(user);
        let url: string;
        this.store.take(1).subscribe(s => url = s.loginRedirectUrl);
        if (url)
          this.router.navigate([url]);
      }
      else {
        //if user logsout then redirect to home page
        console.log("logsout"); 
        // this.router.navigate(['/']);
      }
    });
  }

  ngOnInit () {
    console.log("dispatch");
    this.store.dispatch(this.categoryActions.loadCategories());
    this.store.dispatch(this.tagActions.loadTags());
  }

  ngOnDestroy() {
    Utils.unsubscribe([this.sub, this.sub2]);
  }

  login() {
    this.authService.ensureLogin();
  }

  logout() {
    this.authService.logout();
  }
}
