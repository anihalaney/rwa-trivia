import { user } from './user.reducer';
import { UserActions } from '../actions';
import { User } from '../../../model';

describe('Reducer: user', () => {
  
  it('Initial State', () => {
    let state: User = user(undefined, {type: null, payload: null});

    expect(state).toEqual(null);
  });

  it('Add User Action', () => {
    let aUser: User  = { 
      "userId": "32489230-13423",
      "displayName": "trivia",
      "email": "trivia@realworldfullstack.io",
      "roles": [],
      "authState": null
    };
    let state: User = user(null, {type: UserActions.ADD_USER_WITH_ROLES, payload: aUser});

    expect(state).toEqual(aUser);

  });

  it('Logoff Action', () => {
    let aUser: User  = { 
      "userId": "32489230-13423",
      "displayName": "trivia",
      "email": "trivia@realworldfullstack.io",
      "roles": [],
      "authState": null
    };
    let state: User = user(aUser, {type: UserActions.LOGOFF});

    expect(state).toEqual(null);

  });

  it('Any other action', () => {
    let aUser: User  = { 
      "userId": "32489230-13423",
      "displayName": "trivia",
      "email": "trivia@realworldfullstack.io",
      "roles": [],
      "authState": null
    };
    let state: User = user(aUser, {type: "any other action", payload: null});

    expect(state).toEqual(aUser);

  });


});
