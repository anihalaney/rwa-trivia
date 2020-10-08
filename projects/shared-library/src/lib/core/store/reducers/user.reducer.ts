import { ActionWithPayload, UserActions } from '../actions';
import { User, Game, Friend, Invitation } from '../../../shared/model';
import { Country } from 'shared-library/shared/mobile/component/countryList/model/country.model';


export function user(state: any = null, action: ActionWithPayload<User>): User {
  switch (action.type) {
    case UserActions.ADD_USER_WITH_ROLES:
      return action.payload;
    default:
      return state;
  }
}

export function userDict(state: { [key: string]: User } = {}, action: ActionWithPayload<User>): { [key: string]: User } {
  switch (action.type) {
    case UserActions.LOAD_OTHER_USER_PROFILE_EXTENDED_INFO_SUCCESS:
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


export function userFriendInvitations(state: { [key: string]: Invitation } = {}, action: ActionWithPayload<Invitation>): { [key: string]: Invitation } {
  switch (action.type) {
    case UserActions.LOAD_USER_INVITATION_INFO_SUCCESS:
      const invitations = { ...state };
      if (action.payload) {
        invitations[action.payload.email] = { ...action.payload };
      }
      return invitations;
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
export function userFriends(state: any = null, action: ActionWithPayload<Friend[]>): Friend[] {
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

// user Profile Status
export function userProfileSaveStatus(state: any = 'NONE', action: ActionWithPayload<String>): String {
  switch (action.type) {
    case UserActions.ADD_USER_PROFILE:
      return 'IN PROCESS';
    case UserActions.ADD_USER_PROFILE_SUCCESS:
      return 'SUCCESS';
    case UserActions.ADD_USER_INVITATION_SUCCESS:
      return action.payload;
    case UserActions.MAKE_FRIEND_SUCCESS:
      return 'MAKE FRIEND SUCCESS';
    default:
      return null;
  }
}

// feedback
export function feedback(state: any = 'NONE', action: ActionWithPayload<String>): String {
  switch (action.type) {
    case UserActions.ADD_FEEDBACK:
      return action.payload;
    case UserActions.ADD_FEEDBACK_SUCCESS:
      return 'SUCCESS';
    default:
      return null;
  }
}

export function account(state: any = null, action: ActionWithPayload<any>) {
  switch (action.type) {
    case UserActions.LOAD_ACCOUNT_SUCCESS:
      return action.payload;
    default:
      return state;
  }
}

export function getGameResult(state: any = [], action: ActionWithPayload<any>):
  Game[] {
  switch (action.type) {
    case UserActions.GET_GAME_RESULT_SUCCESS:
      return action.payload;
    default:
      return state;
  }
}

// Load Countries
export function countries(state: any = [], action: ActionWithPayload<any[]>): Country[] {
  switch (action.type) {
    case UserActions.LOAD_COUNTRIES_SUCCESS:
      return action.payload;
    default:
      return state;
  }
}

export function addressUsingLongLat(state: any = null, action: ActionWithPayload<any[]>): any {
  switch (action.type) {
    case UserActions.LOAD_ADDRESS_USING_LAT_LONG_SUCCESS:
      return action.payload;
    default:
      return null;
  }
}

export function addressSuggestions(state: any = null, action: ActionWithPayload<any[]>) {
  switch (action.type) {
    case UserActions.LOAD_ADDRESS_SUGGESTIONS_SUCCESS:
      return action.payload;
    default:
      return null;
  }
}

export function checkDisplayName(state: any = null, action: ActionWithPayload<any>) {
  switch (action.type) {
      case UserActions.CHECK_DISPLAY_NAME_SUCCESS:
          return action.payload;
      default:
          return null;
  }
}

// set update user status
export function userUpdateStatus(state: any = null, action: ActionWithPayload<string>): string {
  switch (action.type) {
    case UserActions.UPDATE_USER_SUCCESS:
      return action.payload;
    default:
      return state;
  }
}
export function firstQuestionBits(state: any = null, action: ActionWithPayload<string>): string {
  switch (action.type) {
    case UserActions.SET_FIRST_QUESTION_BITS_SUCCESS:
      return action.payload;
    default:
      return null;
  }
}

