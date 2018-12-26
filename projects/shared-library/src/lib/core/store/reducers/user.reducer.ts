import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { ActionWithPayload, UserActions } from '../actions';
import { User, Game, Friends, Invitation } from '../../../shared/model';

export function user(state: any = null, action: ActionWithPayload<User>): User {
  switch (action.type) {
    case UserActions.LOGOFF:
      return null;
    case UserActions.ADD_USER_WITH_ROLES:
      return action.payload;
    default:
      return state;
  }
}

export function userDict(state: { [key: string]: User } = {}, action: ActionWithPayload<User>): { [key: string]: User } {
  switch (action.type) {
    case UserActions.LOAD_OTHER_USER_PROFILE_SUCCESS:
      const users = { ...state };
      if (action.payload) {
        users[action.payload.userId] = { ...action.payload };
      }
      return users;
    default:
      return state;
  }
}

export function authInitialized(state: any = false, action: ActionWithPayload<any>): boolean {
  switch (action.type) {
    case UserActions.LOGOFF:
    case UserActions.ADD_USER_WITH_ROLES:
      return true;
    default:
      return state;
  }
}

export const getAuthorizationHeader = (state: User) => (state) ? 'Bearer ' + state.idToken : null;


export function invitationToken(state: any = 'NONE', action: ActionWithPayload<string>): string {
  switch (action.type) {
    case UserActions.STORE_INVITATION_TOKEN:
      return action.payload;
    default:
      return state;
  }
}

export function gameInvites(state: any = [], action: ActionWithPayload<Game[]>): Game[] {
  switch (action.type) {
    case UserActions.LOAD_GAME_INVITES_SUCCESS:
      return action.payload;
    default:
      return state;
  }
}

// Load User Published Question by userId
export function userFriends(state: any = null, action: ActionWithPayload<Friends>): Friends {
  switch (action.type) {
      case UserActions.LOAD_USER_FRIENDS_SUCCESS:
          return action.payload;
      default:
          return state;
  }
}

export function friendInvitations(state: any = [], action: ActionWithPayload<Invitation[]>): Invitation[] {
  switch (action.type) {
      case UserActions.LOAD_FRIEND_INVITATION_SUCCESS:
          return action.payload;
      default:
          return state;
  }
}
