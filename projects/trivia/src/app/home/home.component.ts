import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import * as firebase from "nativescript-plugin-firebase";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styles: []
})
export class HomeComponent implements OnInit {

  constructor(private router: Router) {

  }

  ngOnInit() {

  }



  logout() {
    // this.firebaseService.logout();
    firebase.logout();
    this.router.navigate(["login"]);
  }
}
