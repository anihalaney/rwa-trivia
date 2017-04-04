import { ComponentFixture, TestBed, async, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { TEST_DATA } from '../../testing';
import { AuthGuard } from './auth-guard';
import { AuthenticationService } from './authentication.service';

describe('Service: AuthGuard', () => {
  let authServiceMock = { "isAuthenticated": false,
                          "user": TEST_DATA.userList[0],
                          "showLogin": (url: string) => { } };

  beforeEach(() => TestBed.configureTestingModule({
    imports: [ RouterTestingModule ],
    providers: [
      AuthGuard,
      { "provide": AuthenticationService, "useValue": authServiceMock }
    ]
  }));

  it('canActivate', 
    inject([
      AuthGuard, Router, AuthenticationService
    ],
    (service: AuthGuard, router: Router, authServiceMock) => {

      spyOn(authServiceMock, 'showLogin');
      let retVal = service.canActivate(<any>{}, <any>{}); 
      expect(retVal).toBe(false);
      expect(authServiceMock.showLogin).toHaveBeenCalled();

      authServiceMock.isAuthenticated = true;
      retVal = service.canActivate(<any>{}, <any>{}); 
      expect(retVal).toBe(true);
    })
  );

  it('canLoad', 
    inject([
      AuthGuard, Router, AuthenticationService
    ],
    (service: AuthGuard, router: Router, authServiceMock) => {

      let retVal = service.canLoad(<any>{}); 
      expect(retVal).toBe(false);

      authServiceMock.isAuthenticated = true;
      authServiceMock.user.roles["admin"] = true;
      retVal = service.canLoad(<any>{}); 
      expect(retVal).toBe(true);
    })
  );

});
