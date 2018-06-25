import { ComponentFixture, TestBed, async, inject } from '@angular/core/testing';
import { SharedMaterialModule } from '../../shared/shared-material.module';
//import { OverlayRef } from '@angular/cdk';
import { MatDialogRef, MatDialog, MatDialogConfig } from '@angular/material';
import { Observable } from 'rxjs';
import { ReplaySubject } from 'rxjs/ReplaySubject';
//import { AngularFire, FirebaseAuthState, AuthProviders } from 'angularfire2';
import { AngularFireAuth, AngularFireAuthProvider } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { Store } from '@ngrx/store';

import { AppStore } from '../store/app-store';
import { MockStore, TEST_DATA } from '../../testing';
import { AuthenticationProvider } from './authentication.provider';
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
      AuthenticationProvider, MatDialog,
      UserActions, UIStateActions,
      //{ "provide": MatDialogRef, "useValue": dialogRef },
      { "provide": Store, "useValue": new MockStore<{user: User}>(_initialState) },
      { "provide": AngularFireAuth, "useValue": afAuthMock }
    ]
  }));

  it('Login', 
    inject([
      AuthenticationProvider, MatDialog, AngularFireAuth, Store
    ],  //MdDialogRef, dRef: MatDialogRef<LoginComponent>, 
    (service: AuthenticationProvider, dialog: MatDialog, afAuth: AngularFireAuth, store: Store<AppStore>) => {

      let auth: any = { "providerData": [{
                          "displayName": "trivia",
                          "email": "trivia@realworldfullstack.io"
                        }] };
      let fas: firebase.User;
      fas.uid = "";

      spyOn(store, 'dispatch')
          .and.callFake((action: any) => {
            if (action.payload) {
              expect(action.type).toEqual(UserActions.LOGIN_SUCCESS);
              expect(action.payload.userId).toEqual(fas.uid);
              expect(action.payload.email).toEqual(fas.providerData[0].email);
              expect(action.payload.displayName).toEqual(fas.providerData[0].displayName);
            }
            else
              expect(action.type).toEqual(UserActions.LOGOFF);
          });

      afAuth.authState.next(fas);
      expect(store.dispatch).toHaveBeenCalled();

      afAuth.next(fas);
      expect(store.dispatch).toHaveBeenCalledTimes(2);
    })
  );

  it('getUserRoles', 
    inject([
      AuthenticationProvider, MatDialog, AngularFireDatabase, Store
    ],
    (service: AuthenticationProvider, dialog: MatDialog, db: AngularFireDatabase, store: Store<AppStore>) => {

      spyOn(db, 'object')
          .and.returnValue(Observable.of(["admin", "supervisor"]));

      service.getUserRoles(user).subscribe(user => {
          expect(user.roles.length).toEqual(2);
          expect(user.roles[0]).toEqual("admin");
          expect(user.roles[1]).toEqual("supervisor");
      });

      expect(db.object).toHaveBeenCalled();
    })
  );

  it('ensureLogin', 
    inject([
      AuthenticationProvider, MatDialog, AngularFireAuth, Store
    ],
    (service: AuthenticationProvider, dialog: MatDialog, afAuth: AngularFireAuth, store: MockStore<{user: User}>) => {

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
      AuthenticationProvider, MatDialog, AngularFireAuth, Store
    ],
    (service: AuthenticationProvider, dialog: MatDialog, afAuth: AngularFireAuth, store: MockStore<{user: User}>) => {

      spyOn(afAuth.auth, 'signOut');
      service.logout();
      expect(afAuth.auth.signOut).toHaveBeenCalled();
    })
  );

});
