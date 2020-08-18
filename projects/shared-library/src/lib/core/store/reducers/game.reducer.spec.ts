import {
  activeGames, newGameId, gameCreateStatus, updateUserReactionStatus, getUserReactionStatus, getQuestionSuccess, updateQuestionStatSuccess
} from './game.reducer';
import { testData } from 'test/data';
import { Game } from '../../../shared/model';
import { GameActions, UserActions } from '../actions';

describe('Reducer: activeGames', () => {
  const _testReducer = activeGames;
  const game = [];
  game.push(Game.getViewModel(testData.games[0]));
  it('Initial State', () => {
    const state: Game[] = _testReducer(undefined, { type: null, payload: null });
    expect(state).toEqual([]);
  });

  it('Get activeGames', () => {
    const newState: Game[] = _testReducer([] , { type: GameActions.GET_ACTIVE_GAMES_SUCCESS, payload: game });
    expect(newState).toEqual(game);
  });

  it('Get Error message if has error', () => {
    const newState: Game[] = _testReducer([],
      { type: UserActions.LOGOFF, payload: [] });
       expect(newState).toEqual([]);
  });


});

describe('Reducer: newGameId', () => {
  const _testReducer = newGameId;

  it('Initial State', () => {
    const state: String = _testReducer(undefined, { type: null, payload: null });
    expect(state).toEqual('');
  });

  it('Get gameId after create new game success', () => {
    const newState: String = _testReducer('' , { type: GameActions.CREATE_NEW_SUCCESS, payload: 'xyz' });
    expect(newState).toEqual('xyz');
  });

  it('reset game', () => {
    const newState: String = _testReducer('xyz' , { type: GameActions.RESET_NEW, payload: '' });
    expect(newState).toEqual('');
  });

});

describe('Reducer: gameCreateStatus', () => {
  const _testReducer = gameCreateStatus;

  it('Initial State', () => {
    const state: String = _testReducer(undefined, { type: null, payload: null });
    expect(state).toEqual(null);
  });

  it('error in create new game ', () => {
    const newState: String = _testReducer('' , { type: GameActions.CREATE_NEW_GAME_ERROR, payload: 'Error while creating new game' });
    expect(newState).toEqual('Error while creating new game');
  });

});

describe('Reducer: updateUserReactionStatus', () => {
  const _testReducer = updateUserReactionStatus;

  it('error in create new game ', () => {
    const newState: String = _testReducer('' , { type: GameActions.UPADTE_USER_REACTION_SUCCESS, payload: 'SUCCESS' });
    expect(newState).toEqual('SUCCESS');
  });

});

describe('Reducer: getUserReactionStatus', () => {
  const _testReducer = getUserReactionStatus;

  it('Initial State', () => {
    const state: String = _testReducer(undefined, { type: null, payload: null });
    expect(state).toEqual(null);
  });

  it('Get user reaction success ', () => {
    const newState: String = _testReducer(undefined , { type: GameActions.GET_USER_REACTION_SUCCESS, payload: 'SUCCESS' });
    expect(newState).toEqual('SUCCESS');
  });

});


describe('Reducer: getQuestionSuccess', () => {
  const _testReducer = getQuestionSuccess;

  it('Initial State', () => {
    const state: String = _testReducer(undefined, { type: null, payload: null });
    expect(state).toEqual(null);
  });

  it('Get question success ', () => {
    const newState: String = _testReducer('' , { type: GameActions.GET_QUESTION_SUCCESS, payload: 'sucess' });
    expect(newState).toEqual('sucess');
  });

});

describe('Reducer: updateQuestionStatSuccess', () => {
  const _testReducer = updateQuestionStatSuccess;

  it('Get question success ', () => {
    const newState: String = _testReducer('' , { type: GameActions.UPDATE_QUESTION_STAT_SUCCESS, payload: 'sucess' });
    expect(newState).toEqual('sucess');
  });

});
