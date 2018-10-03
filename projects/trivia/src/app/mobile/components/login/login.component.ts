import { Component, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { FirebaseService } from 'shared-library/core/db-service/firebase.service';
import { RadSideDrawer } from 'nativescript-ui-sidedrawer';
import * as app from "application";

@Component({
  selector: 'login-home',
  templateUrl: './login.component.html',
  styleUrls: ['login.component.scss']
})

export class LoginComponent implements OnInit {

  constructor(
    private tnsFirebaseService: FirebaseService
  ) {
  }


  ngOnInit() {
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
    const sideDrawer = <RadSideDrawer>app.getRootView();
    sideDrawer.showDrawer();
  }

}
