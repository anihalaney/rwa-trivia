import { Component, ViewChild, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { Router } from "@angular/router";
import { AppState, appState } from './../../../store'
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { User, Question } from 'shared-library/shared/model';
import { UserActions } from 'shared-library/core/store/actions';
import { FirebaseService } from 'shared-library/core/db-service/firebase.service';
import { RadSideDrawerComponent } from "nativescript-ui-sidedrawer/angular";
import { RadSideDrawer } from 'nativescript-ui-sidedrawer';

@Component({
  selector: 'login-home',
  templateUrl: './login.component.html',
  styleUrls: ['login.component.scss']
})

export class LoginComponent implements AfterViewInit, OnInit {

  users: any;
  userList: any[];
  userActions: UserActions;
  userDict$: Observable<{ [key: string]: User }>;
  questionOfTheDay$: Observable<Question>;

  constructor(private _userActions: UserActions,
    private store: Store<AppState>,
    private router: Router,
    private tnsFirebaseService: FirebaseService,
    private _changeDetectionRef: ChangeDetectorRef
  ) {
    this.userActions = _userActions;
  }

  @ViewChild('drawerComponent') public drawerComponent: RadSideDrawerComponent;
  private drawer: RadSideDrawer;

  ngAfterViewInit() {
    this.drawer = this.drawerComponent.sideDrawer;
    this._changeDetectionRef.detectChanges();
  }

  ngOnInit() {
    this.store.select(appState.coreState).pipe(select(s => s.user)).subscribe(user => {
      if (user !== null) {
        this.router.navigate(["home"]);
      }
    });

    this.questionOfTheDay$ = this.store.select(appState.coreState).pipe(select(s => s.questionOfTheDay));

    this.questionOfTheDay$.subscribe( data =>  {
      console.log('data');
      console.log(data);
    })
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

  public openDrawer() {
    this.drawer.showDrawer();
  }

  public onCloseDrawerTap() {
    this.drawer.closeDrawer();
  }

}
