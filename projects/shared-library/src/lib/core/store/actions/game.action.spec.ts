import { Question, User, Game, } from '../../../shared/model';
import { GameActions } from './game.actions';
import { testData } from 'test/data';

describe('getActiveGames', () => {
    it('should create an action', () => {
        const user: User = testData.userList[0];
        const action = new GameActions().getActiveGames(user);
        expect(action.type).toEqual(GameActions.GET_ACTIVE_GAMES);
        expect(action.payload).toEqual(user);
    });
});

describe('getActiveGamesSuccess', () => {
    it('should create an action', () => {
        const games = testData.games.map(dbModel => {
            return Game.getViewModel(dbModel);
          });
        const action = new GameActions().getActiveGamesSuccess( games  );

        expect(action.type).toEqual(GameActions.GET_ACTIVE_GAMES_SUCCESS);
        expect(action.payload).toEqual( games );
    });
});

describe('createNewGameSuccess', () => {
    it('should create an action', () => {
        const action = new GameActions().createNewGameSuccess('vTzY3HeUvy9lXxaGHa0d');
        expect(action.type).toEqual(GameActions.CREATE_NEW_SUCCESS);
        expect(action.payload).toEqual('vTzY3HeUvy9lXxaGHa0d');
    });

    describe('resetNewGame', () => {
        it('should create an action', () => {
            const action = new GameActions().resetNewGame();
            expect(action.type).toEqual(GameActions.RESET_NEW);
            expect(action.payload).toEqual(null);
        });
    });

    describe('createNewGameError', () => {
        it('should create an action', () => {
            const error = new Error('Failed with error!');
            const action = new GameActions().createNewGameError(error);
            expect(action.type).toEqual(GameActions.CREATE_NEW_GAME_ERROR);
            expect(action.payload).toEqual(error);
        });
    });

    describe('GetUserReaction', () => {
        it('should create an action', () => {
            const payload = { questionId: '0Iy0OvhLvT6tibIf4HoA', userId: '4kFa6HRvP5OhvYXsH9mEsRrXj4o2' };
            const action = new GameActions().GetUserReaction(payload);
            expect(action.type).toEqual(GameActions.GET_USER_REACTION);
            expect(action.payload).toEqual(payload);
        });
    });

    describe('GetUserReactionSuccess', () => {
        it('should create an action', () => {
            const status = { status: 'Success' };
            const action = new GameActions().GetUserReactionSuccess(status);
            expect(action.type).toEqual(GameActions.GET_USER_REACTION_SUCCESS);
            expect(action.payload).toEqual(status);
        });
    });

    describe('GetQuestionSuccess', () => {
        it('should create an action', () => {
            const question: Question = testData.questions.published[0];
            const action = new GameActions().GetQuestionSuccess(question);
            expect(action.type).toEqual(GameActions.GET_QUESTION_SUCCESS);
            expect(action.payload).toEqual(question);
        });
    });

    describe('GetQuestion', () => {
        it('should create an action', () => {
            const action = new GameActions().GetQuestion(testData.questions.published[0].id);
            expect(action.type).toEqual(GameActions.GET_QUESTION);
            expect(action.payload).toEqual(testData.questions.published[0].id);
        });
    });

    describe('UpdateQuestionStat', () => {
        it('should create an action', () => {
            const payload = {questionId: testData.questions.published[0].id, type: 'CREATED'};
            const action = new GameActions().UpdateQuestionStat(testData.questions.published[0].id, 'CREATED');
            expect(action.type).toEqual(GameActions.UPDATE_QUESTION_STAT);
            expect(action.payload).toEqual(payload);
        });
    });

    describe('UpdateQuestionStatSuccess', () => {
        it('should create an action', () => {
            const action = new GameActions().UpdateQuestionStatSuccess();
            expect(action.type).toEqual(GameActions.UPDATE_QUESTION_STAT_SUCCESS);
            expect(action.payload).toEqual(null);
        });
    });

     describe('UserReaction', () => {
        it('should create an action', () => {
            const payload = { questionId: '0Iy0OvhLvT6tibIf4HoA', userId: '4kFa6HRvP5OhvYXsH9mEsRrXj4o2', status: 'CREATED' };
            const action = new GameActions().UserReaction(payload);
            expect(action.type).toEqual(GameActions.USER_REACTION);
            expect(action.payload).toEqual(payload);
        });
    });

    describe('UpdateUserReactionSuccess', () => {
        it('should create an action', () => {
            const action = new GameActions().UpdateUserReactionSuccess();
            expect(action.type).toEqual(GameActions.UPADTE_USER_REACTION_SUCCESS);
            expect(action.payload).toEqual(null);
        });
    });

});
