import { ComponentFixture, TestBed, async, inject } from '@angular/core/testing';
import { SharedMaterialModule } from '../../shared/shared-material.module';
import { MdDialogRef, MdDialog, OverlayRef, MdDialogConfig } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { AngularFire, FirebaseAuthState, AuthProviders } from 'angularfire2';
import { Store } from '@ngrx/store';

import { AppStore } from '../store/app-store';
import { MockStore, TEST_DATA } from '../../testing';
import { AuthenticationService } from './authentication.service';
import { LoginComponent } from '../components';
import { UserActions, UIStateActions } from '../store/actions';
import { User } from '../../model';

class MockAngularFireAuth extends ReplaySubject<FirebaseAuthState> {    
  logout = (): Promise<void> => {
    return Promise.resolve()
  }
}
describe('Service: AuthenticationService', () => {
  let afAuthMock = new MockAngularFireAuth(); 
  let afMock = { "database": {
                    "object": () => null 
                  },
                  "auth": afAuthMock
                };
  let dialogRef = { "close": () => {}};

  //Define intial state and test state
  let _initialState = { user: null };
  let user = TEST_DATA.userList[0];
  let _testState = { user: user };

  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      //Material
      SharedMaterialModule
    ],
    providers: [
      AuthenticationService, MdDialog,
      UserActions, UIStateActions,
      //{ "provide": MdDialogRef, "useValue": dialogRef },
      { "provide": Store, "useValue": new MockStore<{user: User}>(_initialState) },
      { "provide": AngularFire, "useValue": afMock }
    ]
  }));

  it('Login', 
    inject([
      AuthenticationService, MdDialog, AngularFire, Store
    ],  //MdDialogRef, dRef: MdDialogRef<LoginComponent>, 
    (service: AuthenticationService, dialog: MdDialog, af: AngularFire, store: Store<AppStore>) => {

      let auth: any = { "providerData": [{
                          "displayName": "trivia",
                          "email": "trivia@realworldfullstack.io"
                        }] };
      let fas: FirebaseAuthState = { 
                                    "uid": user.userId,
                                    "provider" : AuthProviders.Google,
                                    "auth": auth 
                                  };

      spyOn(store, 'dispatch')
          .and.callFake((action: any) => {
            if (action.payload) {
              expect(action.type).toEqual(UserActions.LOGIN_SUCCESS);
              expect(action.payload.userId).toEqual(fas.uid);
              expect(action.payload.email).toEqual(fas.auth.providerData[0].email);
              expect(action.payload.displayName).toEqual(fas.auth.providerData[0].displayName);
            }
            else
              expect(action.type).toEqual(UserActions.LOGOFF);
          });

      af.auth.next(fas);
      expect(store.dispatch).toHaveBeenCalled();

      af.auth.next(fas);
      expect(store.dispatch).toHaveBeenCalledTimes(2);
    })
  );

  it('getUserRoles', 
    inject([
      AuthenticationService, MdDialog, AngularFire, Store
    ],
    (service: AuthenticationService, dialog: MdDialog, af: AngularFire, store: Store<AppStore>) => {

      spyOn(af.database, 'object')
          .and.returnValue(Observable.of(["admin", "supervisor"]));

      service.getUserRoles(user).subscribe(user => {
          expect(user.roles.length).toEqual(2);
          expect(user.roles[0]).toEqual("admin");
          expect(user.roles[1]).toEqual("supervisor");
      });

      expect(af.database.object).toHaveBeenCalled();
    })
  );

  it('ensureLogin', 
    inject([
      AuthenticationService, MdDialog, AngularFire, Store
    ],
    (service: AuthenticationService, dialog: MdDialog, af: AngularFire, store: MockStore<{user: User}>) => {

      let redirect_url = "redirect_url";
      store.next(_initialState);

      spyOn(store, 'dispatch')
          .and.callFake((action: any) => {
              expect(action.type).toEqual(UIStateActions.LOGIN_REDIRECT_URL);
              expect(action.payload).toEqual(redirect_url);
          });

      let spy = spyOn(dialog, "open")
                .and.callFake((type: any, options: any) => {
                  expect(typeof type).toEqual("function");
                  expect(options.disableClose).toEqual(false);
                });

      service.ensureLogin("redirect_url");

      expect(store.dispatch).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledTimes(1);

      store.next(_testState);
      expect(store.dispatch).toHaveBeenCalledTimes(1);  //not called twice
      expect(spy).toHaveBeenCalledTimes(1);  //not called twice
    })
  );

  it('logout', 
    inject([
      AuthenticationService, MdDialog, AngularFire, Store
    ],
    (service: AuthenticationService, dialog: MdDialog, af: AngularFire, store: MockStore<{user: User}>) => {

      spyOn(af.auth, 'logout');
      service.logout();
      expect(af.auth.logout).toHaveBeenCalled();
    })
  );

});
