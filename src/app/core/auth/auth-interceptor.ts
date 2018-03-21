import {Injectable} from '@angular/core';
import {HttpEvent, HttpInterceptor, HttpHandler, HttpRequest} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { Store } from '@ngrx/store';
import '../../rxjs-extensions';

import { AppState } from '../../store';
import { authorizationHeader } from '../store';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private store: Store<AppState>) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Get the auth header from the service.
    let authHeader;
    this.store.select(authorizationHeader).take(1).subscribe(ah => authHeader = ah);

    if (authHeader) {
      // Clone the request to add the new header.
      const authReq = req.clone({headers: req.headers.set('Authorization', authHeader)});
      // Pass on the cloned request instead of the original request.
      return next.handle(authReq);
    }
    else {
      return next.handle(req);
    }
  }
}
