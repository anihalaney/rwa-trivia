import { Observable, of } from 'rxjs';
import { GameService, Utils } from 'shared-library/core/services';
import { TestBed, async } from '@angular/core/testing';
import * as GamePlayActions from '../actions/game-play.actions';
import { provideMockActions } from '@ngrx/effects/testing';
import { Actions } from '@ngrx/effects';
import { hot, cold } from 'jest-marbles';
import { testData } from 'test/data';
import { User, Game, GameOptions, ReportQuestion, QuestionMetadata, RouterStateUrl } from 'shared-library/shared/model';
import { GamePlayEffects } from './game-play.effects';
import { StoreModule, MemoizedSelector, Store } from '@ngrx/store';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { coreState, CoreState, ActionWithPayload } from 'shared-library/core/store';
import { RouterNavigationPayload, RouterNavigationAction, ROUTER_NAVIGATION } from '@ngrx/router-store';
import { RoutesRecognized } from '@angular/router';
import { GameActions } from 'shared-library/core/store/actions/game.actions';


describe('GamePlayEffects', () => {
  let effects: GamePlayEffects;
  let actions$: Observable<any>;
  let gameService: GameService;
  let utils: Utils;
  let mockStore: MockStore<CoreState>;
  let mockCoreSelector: MemoizedSelector<CoreState, Partial<CoreState>>;
  const user: User = testData.userList[0];
  let spy: any;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot({})],
      providers: [
        GameActions,
        {
          provide: GameService,
          useValue: {}
        },
        {
          provide: Utils,
          useValue: {}
        },
        GamePlayEffects,
        provideMockStore({
          initialState: { coreState: {} },
          selectors: [
            {
              selector: coreState,
              value: { user }
            }
          ]
        }),
        provideMockActions(() => actions$),
      ],
    });
    mockStore = TestBed.get(Store);
    mockCoreSelector = mockStore.overrideSelector<CoreState, Partial<CoreState>>(coreState, { user });
    effects = TestBed.get(GamePlayEffects);
    gameService = TestBed.get(GameService);
    utils = TestBed.get(Utils);
    actions$ = TestBed.get(Actions);
    mockStore.refreshState();
    spy = spyOn(mockStore, 'dispatch');
  }));

  // loadGame2
  it('loadGame2 with game-play/ route', () => {

    const game = Game.getViewModel(testData.games[0]);
    const routerState: RouterStateUrl = { url: `/game-play/${game.gameId}`, queryParams: {}, params: {} };
    const event: RoutesRecognized = new RoutesRecognized(1, `/game-play/${game.gameId}`, '', null);
    const payload: RouterNavigationPayload<RouterStateUrl> = {
      routerState,
      event
    };

    const action: RouterNavigationAction<RouterStateUrl> = {
      type: ROUTER_NAVIGATION,
      payload
    };

    const completion = new GamePlayActions.LoadGameSuccess(game);

    actions$ = hot('-a---', { a: action });
    const response = cold('-a|', { a: game });
    const expected = cold('--b', { b: completion });
    gameService.getGame = jest.fn(() => {
      return response;
    });
    expect(effects.loadGame2$).toBeObservable(expected);

  });


  // loadGame2 check ResetCurrentGame called
  it('loadGame2 it should dispatch ResetCurrentGame action', () => {

    const game = Game.getViewModel(testData.games[0]);
    const routerState: RouterStateUrl = { url: `/game-play/${game.gameId}`, queryParams: {}, params: {} };
    const event: RoutesRecognized = new RoutesRecognized(1, `/game-play/${game.gameId}`, '', null);
    const payload: RouterNavigationPayload<RouterStateUrl> = {
      routerState,
      event
    };

    const action: RouterNavigationAction<RouterStateUrl> = {
      type: ROUTER_NAVIGATION,
      payload
    };

    actions$ = hot('-a---', { a: action });
    const response = cold('-a|', { a: game });
    gameService.getGame = jest.fn(() => {
      return response;
    });

    spy.and.callFake((action: ActionWithPayload<string>) => {
      expect(action.type).toEqual(GamePlayActions.GamePlayActionTypes.RESET_CURRENT);
      expect(action.payload).toEqual(null);
    });

    effects.loadGame2$.subscribe(res => {
      expect(mockStore.dispatch).toHaveBeenCalled();
    });
  });


  // loadGame2 with game-play/challenge
  it('loadGame2 with game-play/challenge route it should not complete call effects', () => {

    const routerState: RouterStateUrl = { url: `/game-play/challenge`, queryParams: {}, params: {} };
    const event: RoutesRecognized = new RoutesRecognized(1, `/game-play/challenge`, '', null);
    const payload: RouterNavigationPayload<RouterStateUrl> = {
      routerState,
      event
    };

    const action: RouterNavigationAction<RouterStateUrl> = {
      type: ROUTER_NAVIGATION,
      payload
    };

    actions$ = hot('-a--', { a: action });
    const response = cold('-a#', { a: [] });
    const expected = cold('----');
    gameService.getGame = jest.fn(() => {
      return response;
    });
    expect(effects.loadGame2$).toBeObservable(expected);

  });

  // loadGame2 with /game-play/play-game-with-random-user
  it('loadGame2 with /game-play/play-game-with-random-user route it should not complete call effects', () => {

    const routerState: RouterStateUrl = { url: `/game-play/play-game-with-random-user`, queryParams: {}, params: {} };
    const event: RoutesRecognized = new RoutesRecognized(1, `/game-play/play-game-with-random-user`, '', null);
    const payload: RouterNavigationPayload<RouterStateUrl> = {
      routerState,
      event
    };

    const action: RouterNavigationAction<RouterStateUrl> = {
      type: ROUTER_NAVIGATION,
      payload
    };

    actions$ = hot('-a--', { a: action });
    const response = cold('-a#', { a: [] });
    const expected = cold('----');
    gameService.getGame = jest.fn(() => {
      return response;
    });
    expect(effects.loadGame2$).toBeObservable(expected);

  });


  // loadGame2 with /game-play/play-game-with-friend
  it('loadGame2 with /game-play/play-game-with-friend route it should not complete call effects', () => {

    const routerState: RouterStateUrl = { url: `/game-play/play-game-with-friend`, queryParams: {}, params: {} };
    const event: RoutesRecognized = new RoutesRecognized(1, `/game-play/play-game-with-friend`, '', null);
    const payload: RouterNavigationPayload<RouterStateUrl> = {
      routerState,
      event
    };

    const action: RouterNavigationAction<RouterStateUrl> = {
      type: ROUTER_NAVIGATION,
      payload
    };

    actions$ = hot('-a--', { a: action });
    const response = cold('-a#', { a: [] });
    const expected = cold('----');
    gameService.getGame = jest.fn(() => {
      return response;
    });
    expect(effects.loadGame2$).toBeObservable(expected);

  });

  // loadGame2 with /game-play/game-option
  it('loadGame2 with /game-play/game-option route it should not complete call effects', () => {

    const routerState: RouterStateUrl = { url: `/game-play/game-option`, queryParams: {}, params: {} };
    const event: RoutesRecognized = new RoutesRecognized(1, `/game-play/game-option`, '', null);
    const payload: RouterNavigationPayload<RouterStateUrl> = {
      routerState,
      event
    };

    const action: RouterNavigationAction<RouterStateUrl> = {
      type: ROUTER_NAVIGATION,
      payload
    };

    actions$ = hot('-a--', { a: action });
    const response = cold('-a#', { a: [] });
    const expected = cold('----');
    gameService.getGame = jest.fn(() => {
      return response;
    });
    expect(effects.loadGame2$).toBeObservable(expected);

  });


  // startNewGame throws Error
  it('Start New Game throws Error', () => {

    const game = Game.getViewModel(testData.games[0]);
    const gameOptions: GameOptions = game.gameOptions;

    const action = new GamePlayActions.CreateNewGame({ gameOptions, user });
    const completion = new GameActions().createNewGameError('Error while getting game');
    const error = 'Error while getting game';

    actions$ = hot('-a---', { a: action });
    const response = cold('-#|', {}, { error });
    const expected = cold('--b', { b: completion });
    gameService.createNewGame = jest.fn(() => {
      return response;
    });
    utils.setNewGameFirebaseAnalyticsParameter = jest.fn(() => {
      return response;
    });
    expect(effects.startNewGame$).toBeObservable(expected);

  });


  // startNewGame
  it('Start New Game', () => {

    const game = Game.getViewModel(testData.games[0]);
    const gameOptions: GameOptions = game.gameOptions;

    const action = new GamePlayActions.CreateNewGame({ gameOptions, user });
    const completion = new GameActions().createNewGameSuccess(game.gameId);

    actions$ = hot('-a---', { a: action });
    const response = cold('-a|', { a: game.gameId });
    const expected = cold('---b', { b: completion });
    gameService.createNewGame = jest.fn(() => {
      return response;
    });
    utils.setNewGameFirebaseAnalyticsParameter = jest.fn(() => {
      return response;
    });
    expect(effects.startNewGame$).toBeObservable(expected);

  });

  // load Game
  it('Load Game', () => {

    const game = Game.getViewModel(testData.games[0]);

    const action = new GamePlayActions.LoadGame(game.gameId);
    const completion = new GamePlayActions.LoadGameSuccess(game);

    actions$ = hot('-a---', { a: action });
    const response = cold('-a|', { a: game });
    const expected = cold('--b', { b: completion });
    gameService.getGame = jest.fn(() => {
      return response;
    });
    expect(effects.loadGame$).toBeObservable(expected);
  });
  //loadNextQuestion
  it('loadNextQuestion', () => {

    const game = Game.getViewModel(testData.games[0]);
    const question = testData.questions[0];
    const action = new GamePlayActions.GetNextQuestion(game);
    const completion = new GamePlayActions.GetNextQuestionSuccess(question);

    actions$ = hot('-a---', { a: action });
    const response = cold('-a|', { a: question });
    const expected = cold('--b', { b: completion });
    gameService.getNextQuestion = jest.fn(() => {
      return response;
    });
    expect(effects.loadNextQuestion$).toBeObservable(expected);
  });




  //addPlayerQnA
  it('addPlayerQnA', () => {

    const game = Game.getViewModel(testData.games[0]);
    const action = new GamePlayActions.AddPlayerQnA({ gameId: game.gameId, playerQnA: game.playerQnAs[0] });
    const completion = new GamePlayActions.UpdateGameSuccess();

    actions$ = hot('-a---', { a: action });
    const response = cold('-a|', { a: null });
    const expected = cold('--b', { b: completion });
    gameService.addPlayerQnAToGame = jest.fn(() => {
      return response;
    });
    expect(effects.addPlayerQnA$).toBeObservable(expected);
  });

  //setGameOver
  it('setGameOver', () => {

    const game = Game.getViewModel(testData.games[0]);
    const otherUserId = testData.userList[0].userId;
    const action = new GamePlayActions.SetGameOver({ playedGame: game, userId: user.userId, otherUserId: otherUserId });
    const completion = new GamePlayActions.UpdateGameSuccess();

    actions$ = hot('-a---', { a: action });
    const response = cold('-a|', { a: null });
    const expected = cold('---b', { b: completion });
    gameService.setGameOver = jest.fn(() => {
      return response;
    });

    utils.setEndGameFirebaseAnalyticsParameter = jest.fn(() => {
      return response;
    });
    expect(effects.setGameOver$).toBeObservable(expected);
  });

  //getUserAnsweredQuestions
  it('getUserAnsweredQuestions', () => {

    const game = Game.getViewModel(testData.games[0]);
    const questions = testData.questions;
    const action = new GamePlayActions.GetUsersAnsweredQuestion({ userId: user.userId, game: game });
    const completion = new GamePlayActions.GetUsersAnsweredQuestionSuccess(questions);

    actions$ = hot('-a---', { a: action });
    const response = cold('-a|', { a: questions });
    const expected = cold('--b', { b: completion });
    gameService.getUsersAnsweredQuestion = jest.fn(() => {
      return response;
    });

    expect(effects.getUserAnsweredQuestions$).toBeObservable(expected);
  });

  //reportQuestion
  it('reportQuestion', () => {

    const questionMetadata: QuestionMetadata = new QuestionMetadata();
    questionMetadata.reasons = ['Question is not clear'];
    const game = Game.getViewModel(testData.games[0]);
    const reportQuestion: ReportQuestion = new ReportQuestion();
    const questions = testData.questions;
    const questionId = questions.published[0].id;
    reportQuestion.questions = { questionId: questionMetadata };
    reportQuestion.gameId = game.gameId;
    reportQuestion.created_uid = user.userId;
    const action = new GamePlayActions.SaveReportQuestion({ reportQuestion, game });
    const completion = new GamePlayActions.SaveReportQuestionSuccess();

    actions$ = hot('-a---', { a: action });
    const response = cold('-a|', { a: null });
    const expected = cold('---b', { b: completion });
    gameService.saveReportQuestion = jest.fn(() => {
      return response;
    });

    gameService.updateGame = jest.fn(() => {
      return response;
    });

    expect(effects.reportQuestion$).toBeObservable(expected);
  });


  //UpdateGameRound
  it('UpdateGameRound', () => {

    const game = Game.getViewModel(testData.games[0]);
    const action = new GamePlayActions.UpdateGameRound(game.gameId);
    const completion = new GamePlayActions.UpdateGameSuccess();

    actions$ = hot('-a---', { a: action });
    const response = cold('-a|', { a: null });
    const expected = cold('--b', { b: completion });
    gameService.updateGameRound = jest.fn(() => {
      return response;
    });

    expect(effects.UpdateGameRound$).toBeObservable(expected);
  });

});
