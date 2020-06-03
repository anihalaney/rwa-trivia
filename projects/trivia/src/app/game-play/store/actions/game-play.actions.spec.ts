import { User, GameOptions, Game, Question, QuestionMetadata } from 'shared-library/shared/model';
import { testData } from 'test/data';
import * as gamePlayActions from './game-play.actions';

describe('CreateNewGame', () => {
    it('Verify CreateNewGame action class', () => {
        const user: User = testData.userList[0];
        const games = testData.games.map(dbModel => {
            return Game.getViewModel(dbModel);
        });
        const gameOptions: GameOptions = games[0].gameOptions;
        const action = new gamePlayActions.CreateNewGame({ gameOptions, user });

        expect(action.type).toEqual(gamePlayActions.GamePlayActionTypes.CREATE_NEW);
        expect(action.payload).toEqual({ gameOptions, user });
    });
});

describe('LoadGame', () => {
    it('Verify LoadGame action class', () => {
        const action = new gamePlayActions.LoadGame('Game is loading');

        expect(action.type).toEqual(gamePlayActions.GamePlayActionTypes.LOAD_GAME);
        expect(action.payload).toEqual('Game is loading');
    });
});

describe('LoadGameSuccess', () => {
    it('Verify LoadGameSuccess action class', () => {
        const games = testData.games.map(dbModel => {
            return Game.getViewModel(dbModel);
        });
        const action = new gamePlayActions.LoadGameSuccess(games[0]);

        expect(action.type).toEqual(gamePlayActions.GamePlayActionTypes.LOAD_SUCCESS);
        expect(action.payload).toEqual(games[0]);
    });
});

describe('ResetCurrentGame', () => {
    it('Verify ResetCurrentGame action class', () => {
        const action = new gamePlayActions.ResetCurrentGame();

        expect(action.type).toEqual(gamePlayActions.GamePlayActionTypes.RESET_CURRENT);
        expect(action.payload).toBeNull();
    });
});

describe('GetNextQuestion', () => {
    it('Verify GetNextQuestion action class', () => {
        const games = testData.games.map(dbModel => {
            return Game.getViewModel(dbModel);
        });
        const action = new gamePlayActions.GetNextQuestion(games[0]);

        expect(action.type).toEqual(gamePlayActions.GamePlayActionTypes.GET_NEXT_QUESTION);
        expect(action.payload).toEqual(games[0]);
    });
});

describe('GetNextQuestionSuccess', () => {
    it('Verify GetNextQuestionSuccess action class', () => {
        const question: Question = testData.question;
        const action = new gamePlayActions.GetNextQuestionSuccess(question);

        expect(action.type).toEqual(gamePlayActions.GamePlayActionTypes.GET_NEXT_QUESTION_SUCCESS);
        expect(action.payload).toEqual(question);
    });
});

describe('AddPlayerQnA', () => {
    it('Verify AddPlayerQnA action class', () => {
        const games = testData.games.map(dbModel => {
            return Game.getViewModel(dbModel);
        });
        const gameId = games[0].gameId;
        const playerQnA = games[0].playerQnAs[0];
        const action = new gamePlayActions.AddPlayerQnA({ gameId, playerQnA });

        expect(action.type).toEqual(gamePlayActions.GamePlayActionTypes.ADD_PLAYER_QNA);
        expect(action.payload).toEqual({ gameId, playerQnA });
    });
});

describe('AddPlayerQnASuccess', () => {
    it('Verify AddPlayerQnASuccess action class', () => {
        const action = new gamePlayActions.AddPlayerQnASuccess();

        expect(action.type).toEqual(gamePlayActions.GamePlayActionTypes.ADD_PLAYER_QNA_SUCCESS);
        expect(action.payload).toBeNull();
    });
});

describe('SetGameOver', () => {
    it('Verify SetGameOver action class', () => {
        const games = testData.games.map(dbModel => {
            return Game.getViewModel(dbModel);
        });
        const playedGame: Game = games[0];
        const userId: string = games[0].playerIds[0];
        const otherUserId: string = games[0].playerIds[1];
        const action = new gamePlayActions.SetGameOver({ playedGame, userId, otherUserId });

        expect(action.type).toEqual(gamePlayActions.GamePlayActionTypes.SET_GAME_OVER);
        expect(action.payload).toEqual({ playedGame, userId, otherUserId });
    });
});

describe('ResetCurrentQuestion', () => {
    it('Verify ResetCurrentQuestion action class', () => {
        const action = new gamePlayActions.ResetCurrentQuestion();

        expect(action.type).toEqual(gamePlayActions.GamePlayActionTypes.RESET_CURRENT_QUESTION);
        expect(action.payload).toBeNull();
    });
});

describe('UpdateGameSuccess', () => {
    it('Verify UpdateGameSuccess action class', () => {
        const action = new gamePlayActions.UpdateGameSuccess();

        expect(action.type).toEqual(gamePlayActions.GamePlayActionTypes.UPDATE_GAME_SUCCESS);
        expect(action.payload).toBeNull();
    });
});

describe('GetUsersAnsweredQuestion', () => {
    it('Verify GetUsersAnsweredQuestion action class', () => {
        const games = testData.games.map(dbModel => {
            return Game.getViewModel(dbModel);
        });
        const action = new gamePlayActions.GetUsersAnsweredQuestion({ userId: games[0].playerIds[0], game: games[0] });

        expect(action.type).toEqual(gamePlayActions.GamePlayActionTypes.GET_USERS_ANSWERED_QUESTION);
        expect(action.payload).toEqual({ userId: games[0].playerIds[0], game: games[0] });
    });
});

describe('GetUsersAnsweredQuestionSuccess', () => {
    it('Verify GetUsersAnsweredQuestionSuccess action class', () => {
        const games = testData.games.map(dbModel => {
            return Game.getViewModel(dbModel);
        });
        const action = new gamePlayActions.GetUsersAnsweredQuestionSuccess({ userId: games[0].playerIds[0], game: games[0] });

        expect(action.type).toEqual(gamePlayActions.GamePlayActionTypes.GET_USERS_ANSWERED_QUESTION_SUCCESS);
        expect(action.payload).toEqual({ userId: games[0].playerIds[0], game: games[0] });
    });
});

describe('SaveReportQuestion', () => {
    it('Verify SaveReportQuestion action class', () => {
        const games = testData.games.map(dbModel => {
            return Game.getViewModel(dbModel);
        });
        const info: { [key: string]: QuestionMetadata } = {};
        const questionMetadata = new QuestionMetadata();
        questionMetadata.reasons = ['Other Reason'];
        const reportQuestion = {
            questions: { 'J4uw0TgkfrqFqKgbYqkv': questionMetadata },
            created_uid: testData.userList[0].userId,
            gameId: games[0].gameId
        };
        const action = new gamePlayActions.SaveReportQuestion({ reportQuestion: reportQuestion, game: games[0] });

        expect(action.type).toEqual(gamePlayActions.GamePlayActionTypes.SAVE_REPORT_QUESTION);
        expect(action.payload).toEqual({ reportQuestion: reportQuestion, game: games[0] });
    });
});

describe('SaveReportQuestionSuccess', () => {
    it('Verify SaveReportQuestionSuccess action class', () => {
        const action = new gamePlayActions.SaveReportQuestionSuccess();

        expect(action.type).toEqual(gamePlayActions.GamePlayActionTypes.SAVE_REPORT_QUESTION_SUCCESS);
        expect(action.payload).toBeNull();
    });
});

describe('UpdateGameRound', () => {
    it('Verify UpdateGameRound action class', () => {
        const action = new gamePlayActions.UpdateGameRound('Round Updated');

        expect(action.type).toEqual(gamePlayActions.GamePlayActionTypes.UPDATE_GAME_ROUND);
        expect(action.payload).toEqual('Round Updated');
    });
});
