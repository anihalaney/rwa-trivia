import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { Store, select } from '@ngrx/store';
import { AppState, appState } from './../store';
import { User } from 'shared-library/shared/model';
import { Subscription } from 'rxjs';
import { FirebaseService } from 'shared-library/core/db-service/firebase.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styles: []
})
export class HomeComponent implements OnInit {
  user: User = new User();
  sub: Subscription;
  constructor(private router: Router,
    private store: Store<AppState>,
    private tnsFirebaseService: FirebaseService,
  ) {

  }

  ngOnInit() {
    this.sub = this.store.select(appState.coreState).pipe(select(s => s.user)).subscribe(user => {
      this.user = user;
    });
  }


  logout() {
    this.tnsFirebaseService.logout();
    this.router.navigate(["login"]);

  }
}
