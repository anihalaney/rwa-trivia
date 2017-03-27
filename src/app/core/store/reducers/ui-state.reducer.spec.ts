import { loginRedirectUrl } from './ui-state.reducer';
import { UIStateActions } from '../actions';

describe('Reducer: uiState', () => {
  
  it('Initial State', () => {
    let state: string = loginRedirectUrl(undefined, {type: null, payload: null});

    expect(state).toEqual(null);
  });

  it('Url Action', () => {
    let url: string  = "/dashboard";
    let state: string = loginRedirectUrl(null, {type: UIStateActions.LOGIN_REDIRECT_URL, payload: url});

    expect(state).toEqual(url);

  });

  it('Any other action', () => {
    let url: string  = "/dashboard";
    let state: string = loginRedirectUrl(url, {type: "any other action", payload: "admin"});

    expect(state).toEqual(url);

  });


});
