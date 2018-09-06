import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import * as firebase from "nativescript-plugin-firebase";
import { Store, select } from '@ngrx/store';
import { AppState, appState } from './../store';
import { User } from './../../../../shared-library/src/lib/shared/model';
import { ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styles: []
})
export class HomeComponent implements OnInit {
  user: User = new User();
  sub: Subscription;
  constructor(private router: Router, private store: Store<AppState>) {

  }

  ngOnInit() {
    this.sub = this.store.select(appState.coreState).pipe(select(s => s.user)).subscribe(user => {
      this.user = user;
    });
  }



  logout() {
    // this.firebaseService.logout();
    firebase.logout();
    this.router.navigate(["login"]);
  }
}
