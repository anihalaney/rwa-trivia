import { GameEffects } from './game.effects';
import { Observable, of } from 'rxjs';
import { GameService } from 'shared-library/core/services';
import { TestBed } from '@angular/core/testing';
import { GameActions } from '../actions';
import { provideMockActions } from '@ngrx/effects/testing';
import { Actions } from '@ngrx/effects';
import { hot, cold } from 'jest-marbles';
import { testData } from 'test/data';
import { User, Game } from 'shared-library/shared/model';

describe('GameEffects', () => {
  let effects: GameEffects;
  let actions$: Observable<any>;
  let gameService: GameService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        GameActions,
        GameEffects,
        {
          provide: GameService,
          useValue: { userReaction: jest.fn() }
        },
        provideMockActions(() => actions$),
      ],
    });
    effects = TestBed.get(GameEffects);
    gameService = TestBed.get(GameService);
    actions$ = TestBed.get(Actions);
  });

  it('User Reaction', () => {
    const questionId = testData.question.id;
    const userId = testData.userList[0].userId;
    const action = new GameActions().UserReaction({ questionId: questionId, userId: userId, status: 'Like' });
    const completion = new GameActions().UpdateUserReactionSuccess();

    actions$ = hot('-a---', { a: action });
    const response = cold('-a|', { a: null });
    const expected = cold('--b', { b: completion });
    gameService.userReaction = jest.fn(() => {
      return response;
    });
    expect(effects.UserReaction$).toBeObservable(expected);
  });

  it('Get question', () => {
    const questionId = testData.question.id;
    const action = new GameActions().GetQuestion(questionId);
    const completion = new GameActions().GetQuestionSuccess(testData.question);

    actions$ = hot('-a---', { a: action });
    const response = cold('-a|', { a: testData.question });
    const expected = cold('--b', { b: completion });
    gameService.getQuestion = jest.fn(() => {
      return response;
    });
    expect(effects.GetQuestion$).toBeObservable(expected);
  });
  it('Get User Reaction', () => {
    const questionId = testData.question.id;
    const userId = testData.userList[0].userId;
    const successResponse = { status: 'like' };
    const action = new GameActions().GetUserReaction({ questionId, userId });

    const completion = new GameActions().GetUserReactionSuccess(successResponse);

    actions$ = hot('-a---', { a: action });
    const response = cold('-a|', { a: successResponse });
    const expected = cold('--b', { b: completion });
    gameService.getUserReaction = jest.fn(() => {
      return response;
    });
    expect(effects.getUserReaction$).toBeObservable(expected);
  });

  it('Get active games', () => {
    const user: User = testData.userList[0];
    const games: Game[] = testData.games.map(dbModel => {
      return Game.getViewModel(dbModel);
    });
    const action = new GameActions().getActiveGames(user);
    const completion = new GameActions().getActiveGamesSuccess(games);

    actions$ = hot('-a---', { a: action });
    const response = cold('-a|', { a: games });
    const expected = cold('--b', { b: completion });
    gameService.getActiveGames = jest.fn(() => {
      return response;
    });
    expect(effects.getActiveGames$).toBeObservable(expected);
  });

  it('Update question stat', () => {
    const questionId = testData.question.id;
    const action = new GameActions().UpdateQuestionStat(questionId, 'CREATED');
    const completion = new GameActions().UpdateQuestionStatSuccess();

    actions$ = hot('-a---', { a: action });
    const response = cold('-a|', { a: null });
    const expected = cold('--b', { b: completion });
    gameService.updateQuestionStat = jest.fn(() => {
      return response;
    });
    expect(effects.UpdateQuestionStat$).toBeObservable(expected);
  });

});
