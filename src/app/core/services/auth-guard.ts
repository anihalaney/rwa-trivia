import { Injectable }    from '@angular/core';
import { CanActivate, CanActivateChild, CanLoad, 
         Route, ActivatedRouteSnapshot, RouterStateSnapshot }    from '@angular/router';
import { AuthenticationService }    from './authentication.service';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad {
  constructor(private authService: AuthenticationService) {

  }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (!this.authService.isAuthenticated){
      this.authService.showLogin(state.url);
      return false;
    }

    return true;
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.canActivate(route, state);
  }

  canLoad(route: Route): boolean  {
    if (this.authService.isAuthenticated && this.authService.user.roles["admin"])
      return true;

    return false;
  }
}
