import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import * as firebase from "nativescript-plugin-firebase";
import { Subscription } from 'rxjs';

@Component({
  selector: 'login-home',
  templateUrl: './login.component.html',
  styles: []
})
export class LoginComponent implements OnInit {

  sub: Subscription;
  constructor(private router: Router) {

  }

  ngOnInit() {
    firebase.init({
      onAuthStateChanged: (user) => {
        if (user.loggedIn) {
          this.router.navigate(["home"]);
        }
      }
    });
  }

  onClick() {

  }

  googleLogin() {
    firebase.login({
      type: firebase.LoginType.GOOGLE,
    }).then(
      function (result) {
        JSON.stringify(result);
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
        scope: ['public_profile', 'email']
      }
    }).then(
      function (result) {
        JSON.stringify(result);
      },
      function (errorMessage) {
        console.log(errorMessage);
      }
    );
  }
}
