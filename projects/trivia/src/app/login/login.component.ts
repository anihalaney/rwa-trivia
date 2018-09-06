import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import * as firebase from "nativescript-plugin-firebase";
import { AppState, appState } from './../store'
import { User } from './../../../../shared-library/src/lib/shared/model';
import { UserActions, UIStateActions } from './../../../../shared-library/src/lib/core/store/actions'
import { Store, select } from '@ngrx/store';
import { Observable, Subscription, pipe } from 'rxjs';
import { TestServiceService } from './../../../../shared-library/src/test.service';
@Component({
  selector: 'login-home',
  templateUrl: './login.component.html',
  styleUrls: ['login.component.scss']
})

export class LoginComponent implements OnInit {

  users: any;
  userList: any[];
  userActions: UserActions;
  userDict$: Observable<{ [key: string]: User }>;
  constructor(private _userActions: UserActions, private store: Store<AppState>, private router: Router) {
    this.userActions = _userActions;
  }

  ngOnInit() {
    firebase.init({
      onAuthStateChanged: (user) => {
        if (user.loggedIn) {
          let userObj: User = new User();
          userObj.userId = user.user.uid;
          userObj.displayName = user.user.name;
          userObj.email = user.user.email;
          this.store.dispatch(this.userActions.loginSuccess(userObj));
          setTimeout(() => {
            this.router.navigate(["home"]);
          }, 1000);
        }
      }
    });
  }

  googleLogin() {
    firebase.login({
      type: firebase.LoginType.GOOGLE,
    }).then(
      function (result) {
      },
      function (errorMessage) {
        console.log(errorMessage);
      }
    );

  }

  facebookLogin() {
    firebase.login({
      type: firebase.LoginType.FACEBOOK,
      facebookOptions: {
      }
    }).then(
      function (result) {
      },
      function (errorMessage) {
        console.log(errorMessage);
      }
    );
  }
}
