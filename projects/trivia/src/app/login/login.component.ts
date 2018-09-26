import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { AppState, appState } from './../store'
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { User } from 'shared-library/shared/model';
import { UserActions } from 'shared-library/core/store/actions';
import { FirebaseService } from 'shared-library/core/db-service/firebase.service';
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
  }

  /**
   * Google Login
   */
  googleLogin() {
    this.tnsFirebaseService.googleConnect();

  }

  /**
   * Facebook Login
   */
  facebookLogin() {
    this.tnsFirebaseService.facebookConnect();
  }
}
