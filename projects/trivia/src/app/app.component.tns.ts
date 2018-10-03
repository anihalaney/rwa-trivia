import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from "@angular/router";
import * as firebase from 'nativescript-plugin-firebase'
import { RouterExtensions } from "nativescript-angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})

export class AppComponent implements OnInit {

  constructor(private router: Router, private routerExtensions: RouterExtensions) {
  }
  ngOnInit() {
    // Init your component properties here.
    firebase.init({
      // Optionally pass in properties for database, authentication and cloud messaging,
      // see their respective docs.
    }).then(
      instance => {
        console.log("firebase.init");
      },
      error => {
      }
    );
  }

}
