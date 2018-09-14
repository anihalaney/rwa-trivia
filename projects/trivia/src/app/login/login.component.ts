import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import * as firebase from "nativescript-plugin-firebase";
import { AppState, appState } from './../store'
import { User } from './../../../../shared-library/src/lib/shared/model';
import { UserActions, UIStateActions } from './../../../../shared-library/src/lib/core/store/actions'
import { Store, select } from '@ngrx/store';
import { Observable, Subscription, pipe } from 'rxjs';
import { TNSFirebaseService } from './../nativescript/core/services/tns-firebase.service';
import { FirebaseService } from './../../../../shared-library/src/lib/core/db-services/firebase.service'
import { DbBaseService } from './../../../../shared-library/src/lib/core/db-services/dbbase.service';
// import { DbService } from 'shared-library/core';
 
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
  constructor(private _userActions: UserActions,
    private store: Store<AppState>,
    private router: Router,
    private tnsFirebaseService: FirebaseService,
   ) {
    this.userActions = _userActions;
  }

  ngOnInit() {
    this.store.select(appState.coreState).pipe(select(s => s.user)).subscribe(user => {
      if (user !== null) {
        this.router.navigate(["home"]);
      }
    });
    // this.dbService.getData()
    // this.tnsService.getData();
    console.log('called');
  }

  googleLogin() {
    this.tnsFirebaseService.googleConnect();

  }

  facebookLogin() {
    console.log('facebook ');
    this.tnsFirebaseService.facebookConnect();
    // firebase.login({
    //   type: firebase.LoginType.FACEBOOK,
    //   facebookOptions: {
    //   }
    // }).then(
    //   function (result) {
    //   },
    //   function (errorMessage) {
    //     console.log(errorMessage);
    //   }
    // );
  }
}
