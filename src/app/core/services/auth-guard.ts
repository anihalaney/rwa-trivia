import { Injectable }    from '@angular/core';
import { CanActivate, CanActivateChild, 
         Route, ActivatedRouteSnapshot, RouterStateSnapshot }    from '@angular/router';
import { AuthenticationService }    from './authentication.service';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { AppState, appState } from '../../store';
import { User } from '../../model';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(private store: Store<AppState>, private authService: AuthenticationService) {

  }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    console.log("canActivate");
    return this.store.select(appState.coreState).select(s => s.authInitialized).filter(i => i).take(1).switchMap(i => {
     this.authService.ensureLogin();
     return this.store.select(appState.coreState).select(s => s.user).filter(u => (u != null && u.userId != "")).take(1).map(u => true)
    });
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.canActivate(route, state);
  }
}
