import { ComponentFixture, TestBed, async, inject } from '@angular/core/testing';
import { EffectsTestingModule, EffectsRunner } from '@ngrx/effects/testing';
import { Observable } from 'rxjs/Observable';

import { TEST_DATA } from '../../../testing/test.data';
import { UserEffects } from './user.effects';
import { UserActions } from '../actions';
import { AuthenticationService } from '../../services';

describe('Effects: UserEffects', () => {
  let _runner: EffectsRunner;
  let _effects: UserEffects;
  let _service: AuthenticationService;
  let authMock = {"getUserRoles": () => Observable.of(TEST_DATA.userList[0]) };

  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      EffectsTestingModule
    ],
    providers: [
      UserEffects, UserActions, 
      {"provide": AuthenticationService, "useValue": authMock}
    ]
  }));

  it('Call Add user with roles after login success', 
    inject([
      EffectsRunner, UserEffects
    ],
    (runner, userEffects) => {
      _runner = runner;
      _effects = userEffects;

      _runner.queue({ type: UserActions.LOGIN_SUCCESS });

      _effects.loadUserRoles$.subscribe(result => {
        expect(result.type).toEqual(UserActions.ADD_USER_WITH_ROLES);
        expect(result.payload).toEqual(TEST_DATA.userList[0]);
      });

    })
  );
});
