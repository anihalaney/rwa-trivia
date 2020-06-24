import { currentGame, currentGameQuestion, updateGame, userAnsweredQuestion, saveReportQuestion } from './game-play.reducer';
import { Game, Question } from 'shared-library/shared/model';
import { testData } from 'test/data';
import { GamePlayActionTypes } from '../actions';
import { UserActions } from 'shared-library/core/store';

describe('Reducer: currentGame', () => {
    const _testReducer = currentGame;
    const games = testData.games.map(dbModel => {
        return Game.getViewModel(dbModel);
    });

    it('Initial State', () => {
        const state: Game = _testReducer(undefined, { type: null, payload: null });
        expect(state).toEqual(null);
    });

    it('Load current game', () => {
        const newState: Game = _testReducer(games[0], { type: GamePlayActionTypes.LOAD_SUCCESS, payload: games[0] });
        expect(newState).toEqual(games[0]);
    });

    it('Logoff current game', () => {
        const newState: Game = _testReducer(undefined, { type: UserActions.LOGOFF, payload: null });
        expect(newState).toEqual(null);
    });

    it('Reset current game', () => {
        const newState: Game = _testReducer(games[0], { type: GamePlayActionTypes.RESET_CURRENT, payload: null });
        expect(newState).toEqual(null);
    });
});

describe('Reducer: currentGameQuestion', () => {
    const _testReducer = currentGameQuestion;
    const question: Question = testData.question;

    it('Initial State', () => {
        const state: Question = _testReducer(undefined, { type: null, payload: null });
        expect(state).toEqual(null);
    });

    it('Get nexr question', () => {
        const newState: Question = _testReducer(question, { type: GamePlayActionTypes.GET_NEXT_QUESTION_SUCCESS, payload: question });
        expect(newState).toEqual(question);
    });

    it('Logoff current game question', () => {
        const newState: Question = _testReducer(null, { type: UserActions.LOGOFF, payload: null });
        expect(newState).toEqual(null);
    });

    it('Reset current question', () => {
        const newState: Question = _testReducer(null, { type: GamePlayActionTypes.RESET_CURRENT_QUESTION, payload: null });
        expect(newState).toEqual(null);
    });
});

describe('Reducer: updateGame', () => {
    const _testReducer = updateGame;

    it('Initial State', () => {
        const state: Game = _testReducer(undefined, { type: null, payload: null });
        expect(state).toEqual(null);
    });

    it('Update game', () => {
        const newState: Game = _testReducer(null, { type: GamePlayActionTypes.UPDATE_GAME_SUCCESS, payload: null });
        expect(newState).toEqual(null);
    });
});

describe('Reducer: userAnsweredQuestion', () => {
    const _testReducer = userAnsweredQuestion;
    const userAnswere = testData.userAnsweredQuestion;

    it('Initial State', () => {
        const state: any = _testReducer(undefined, { type: null, payload: null });
        expect(state).toEqual(null);
    });

    it('Get user answered question', () => {
        const newState: any = _testReducer(userAnswere, { type: GamePlayActionTypes.GET_USERS_ANSWERED_QUESTION_SUCCESS, payload: userAnswere });
        expect(newState).toEqual(userAnswere);
    });
});

describe('Reducer: saveReportQuestion', () => {
    const _testReducer = saveReportQuestion;

    it('Save report question', () => {
        const newState = _testReducer('SUCCESS', { type: GamePlayActionTypes.SAVE_REPORT_QUESTION_SUCCESS, payload: null });
        expect(newState).toEqual('SUCCESS');
    });
});
