import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { MatSnackBar } from '@angular/material';
import { Subscription } from 'rxjs/Subscription';

import { AppStore } from '../../core/store/app-store';
import { CategoryActions, TagActions, QuestionActions, GameActions, BulkUploadActions } from '../../core/store/actions';
import { AuthenticationService, Utils } from '../../core/services';
import { User, BulkUploadFileInfo } from '../../model';

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

  theme: string = "";
  constructor(private renderer: Renderer2,
              private authService: AuthenticationService,
              private categoryActions: CategoryActions,
              private tagActions: TagActions,
              private questionActions: QuestionActions,
              private bulkUploadActions: BulkUploadActions,
              private gameActions: GameActions,
              private store: Store<AppStore>,
              public router: Router,
              public snackBar: MatSnackBar) {
    
    this.sub = store.select(s => s.questionSaveStatus).subscribe((status) => {
      if (status === "SUCCESS")
        this.snackBar.open("Question saved!", "", {duration: 2000});
      if (status === "IN PROGRESS")
        this.router.navigate(['/my/questions']);
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
        //if user logs out then redirect to home page
        console.log("logout"); 
        this.router.navigate(['/']);
      }
    });
  }

  ngOnInit () {
    console.log("dispatch");
    this.store.dispatch(this.categoryActions.loadCategories());
    this.store.dispatch(this.tagActions.loadTags());
    this.store.dispatch(this.bulkUploadActions.loadFileRecord());
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

  toggleTheme() {
    if (this.theme === "") {
      this.theme = "dark";
      this.renderer.addClass(document.body, this.theme)
    } else {
      this.renderer.removeClass(document.body, this.theme)
      this.theme = "";
    }
  }
}
