import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, mergeMap, take } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { CoreState, authorizationHeader } from '../store';
import { AuthenticationProvider } from './authentication.provider';
import { Router } from '@angular/router';
import { interceptorConstants } from '../../shared/model';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private store: Store<CoreState>, private authService: AuthenticationProvider, private router: Router) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Get the auth header from the service.
    let authHeader;
    this.store.select(authorizationHeader).pipe(take(1)).subscribe(ah => {
      authHeader = ah;
    }
    );

    if (authHeader) {
      // Clone the request to add the new header.
      let authReq = req.clone({ headers: req.headers.set('Authorization', authHeader) });

      // set request count limit on 500 error
      let errorCount = 0;

      // Pass on the cloned request instead of the original request.
      return next.handle(authReq).pipe(catchError((error, caught) => {

        if (error.status === interceptorConstants.UNAUTHORIZED) {
          // logout users, redirect to login page
          this.authService.logout();
          this.router.navigate(['/dashboard']);

        }

         if (error.status === interceptorConstants.TOKEN_EXPIRE) {
          return this.authService.refreshToken().pipe(mergeMap((tokenResponse) => {
            authReq = req.clone({ headers: req.headers.set('Authorization', 'Bearer ' + tokenResponse) });
            return next.handle(authReq);
          }));

         }

        console.log('error------>', error);

        if (error.status === interceptorConstants.INTERNAL_ERROR || error.status === interceptorConstants.GATEWAY_TIMEOUT) {
          if (errorCount < interceptorConstants.MAXIMUM_RE_REQUEST_LIMIT) {
            errorCount++;
            return next.handle(authReq);
          } else {
            this.router.navigate(['/dashboard']);
          }
        }

        // return all others errors
        return throwError(error);

      })) as any;
    } else {
      return next.handle(req);
    }
  }
}
