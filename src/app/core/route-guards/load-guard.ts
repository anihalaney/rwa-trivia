import { Injectable } from '@angular/core';
import { CanLoad, Route } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take, filter, switchMap } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { AuthenticationProvider } from '../auth';
import { AppState, appState } from '../../store';

@Injectable()
export class AdminLoadGuard implements CanLoad {
  constructor(private store: Store<AppState>, private authService: AuthenticationProvider) {

  }
  canLoad(route: Route): Observable<boolean> {
    return this.store.select(appState.coreState).pipe(
      map(s => s.authInitialized), 
      filter(i => i),
      take(1),
      switchMap(i => {
        this.authService.ensureLogin();
        return this.store.select(appState.coreState).pipe(
          map(s => s.user),
          filter(u => (u != null && u.userId != "")),
          take(1),
          map(u => u.roles && u.roles["admin"]));
      })
    );
  }
}

@Injectable()
export class BulkLoadGuard implements CanLoad {
  constructor(private store: Store<AppState>, private authService: AuthenticationProvider) {

  } canLoad(route: Route): Observable<boolean> {
    return this.store.select(appState.coreState).pipe(
      map(s => s.authInitialized),
      filter(i => i),
      take(1),
      switchMap(i => {
        this.authService.ensureLogin();
        return this.store.select(appState.coreState).pipe(
          map(s => s.user),
          filter(u => (u != null && u.userId != "")),
          take(1),
          map(u => u.roles && u.roles["admin"] || u.roles["bulkuploader"]));
      })
    );
  }
}
