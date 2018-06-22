import { Injectable } from '@angular/core';
import {
  CanLoad,
  Route, ActivatedRouteSnapshot, RouterStateSnapshot
} from '@angular/router';
import { AuthenticationProvider } from '../auth';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

import { AppState, appState } from '../../store';
import { User } from '../../model';

@Injectable()
export class AdminLoadGuard implements CanLoad {
  constructor(private store: Store<AppState>, private authService: AuthenticationProvider) {

  }
  canLoad(route: Route): Observable<boolean> {
    return this.store.select(appState.coreState).select(s => s.authInitialized).filter(i => i).take(1).switchMap(i => {
      this.authService.ensureLogin();
      return this.store.select(appState.coreState).select(s => s.user).filter(u => (u != null && u.userId != "")).take(1).map(u => u.roles && u.roles["admin"])
    });
  }
}

@Injectable()
export class BulkLoadGuard implements CanLoad {
  constructor(private store: Store<AppState>, private authService: AuthenticationProvider) {

  } canLoad(route: Route): Observable<boolean> {
    return this.store.select(appState.coreState).select(s => s.authInitialized).filter(i => i).take(1).switchMap(i => {
      this.authService.ensureLogin();
      return this.store.select(appState.coreState).select(s => s.user).filter(u => (u != null && u.userId != "")).take(1).map(u => u.roles && u.roles["admin"] || u.roles["bulkuploader"])
    });
  }
}
