import { Injectable } from '@angular/core';
import {
  CanActivate, CanActivateChild,
  ActivatedRouteSnapshot, RouterStateSnapshot
} from '@angular/router';
import { Observable } from 'rxjs';
import { map, filter, take, switchMap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AuthenticationProvider } from '../auth';
import { CoreState, coreState } from '../store';


@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(private store: Store<CoreState>, private authService: AuthenticationProvider) {

  }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.store.select(coreState).pipe(
      map(s => s.authInitialized),
      filter(i => i),
      take(1),
      switchMap(i => this.authService.ensureLogin(state.url)));
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.canActivate(route, state);
  }
}
