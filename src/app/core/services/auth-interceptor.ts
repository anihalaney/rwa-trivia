import {Injectable} from '@angular/core';
import {HttpEvent, HttpInterceptor, HttpHandler, HttpRequest} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import {AuthenticationService} from './authentication.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthenticationService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Get the auth header from the service.
    const authHeader = this.authService.authorizationHeader;

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
