import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { GameDialogComponent } from './game-dialog.component';
import { NO_ERRORS_SCHEMA, ChangeDetectorRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { Utils } from 'shared-library/core/services';
import { User, Game, PlayerMode, GameStatus, PlayerQnA } from 'shared-library/shared/model';
import { AppState, appState } from '../../../store';
import { testData } from 'test/data';
import { MatSnackBarModule, MAT_DIALOG_DATA } from '@angular/material';
import { UserActions } from "shared-library/core/store/actions";
import { Router } from "@angular/router";
import { gamePlayState, GamePlayState } from "../../store";
import { Subscription } from 'rxjs';
import * as gameplayactions from "../../store/actions";
import { CoreState } from 'shared-library/core/store';
import { GameQuestionComponent } from "../game-question/game-question.component";

describe('GameDialogComponent', () => {

    let component: GameDialogComponent;
    let fixture: ComponentFixture<GameDialogComponent>;
    let spy: any;
    let mockStore: MockStore<AppState>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [GameDialogComponent, GameQuestionComponent],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [
                UserActions,
                {
                    provide: Router,
                    useValue: { navigate(url) {}}
                },
                {
                    provide: MAT_DIALOG_DATA,
                    useValue: {}
                },
                {provide: Utils, useValue: {
                    getTimeDifference(turnAt: number) {
                        return 1588313130838 - turnAt;
                    },
                    convertIntoDoubleDigit(digit: Number) {
                        return (digit < 10) ? `0${digit}` : `${digit}`;
                    },
                    unsubscribe(subs: Subscription[]) {
                        subs.forEach(sub => {
                            if (sub && sub instanceof Subscription) {
                              sub.unsubscribe();
                            }
                          });
                    }
                }},
                provideMockStore( {
                    selectors: [
                      {
                        selector: appState.coreState,
                        value: {}
                      },
                      {
                          selector: gamePlayState,
                          value: {}
                      }
                    ]
                  })
            ],
            imports: [ MatSnackBarModule ]
        });

    }));

    beforeEach(() => {
        // create component
        fixture = TestBed.createComponent(GameDialogComponent);
        // mock data
        mockStore = TestBed.get(Store);
        spy = spyOn(mockStore, 'dispatch');

        component = fixture.debugElement.componentInstance;

        const dbModel = testData.games[0];
        component.game = Game.getViewModel(dbModel);
        component.MAX_TIME_IN_SECONDS = 16;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });


    it('game data should be set after the data is emitted', () => {

        mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {
            user: testData.userList[0]
        });

        const dbModel = Game.getViewModel(testData.games[0]);
        mockStore.overrideSelector<AppState, Partial<GamePlayState>>(appState.gamePlayState, {
            currentGame: dbModel
        });
        mockStore.refreshState();
        expect(component.game).toEqual(dbModel);
        expect(component.showLoader).toEqual(false);
    });


    it('user and other user\'s earned badges should be set after the game data is emitted', () => {

        mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {
            user: testData.userList[0]
        });

        const dbModel = Game.getViewModel(testData.games[0]);
        mockStore.overrideSelector<AppState, Partial<GamePlayState>>(appState.gamePlayState, {
            currentGame: dbModel
        });
        mockStore.refreshState();
        expect(component.earnedBadges).toEqual(dbModel.stats['4kFa6HRvP5OhvYXsH9mEsRrXj4o2'].badge);
        expect(component.earnedBadgesByOtherUser).toEqual(dbModel.stats['yP7sLu5TmYRUO9YT4tWrYLAqxSz1'].badge);

    });


    it('user and other user\'s earned badges should not be set if the game is old after the game data is emitted', () => {

        mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {
            user: testData.userList[0]
        });
        // console.log(testData.games.length);
        const dbModel = Game.getViewModel(testData.games[16]);
        mockStore.overrideSelector<AppState, Partial<GamePlayState>>(appState.gamePlayState, {
            currentGame: dbModel
        });
        mockStore.refreshState();
        expect(component.earnedBadges).toEqual([]);
        expect(component.earnedBadgesByOtherUser).toEqual([]);

    });

    it('earnedBadgesByOtherUser should not be set if the game is single player', () => {

        mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {
            user: testData.userList[0]
        });
        // console.log(testData.games.length);
        const dbModel = Game.getViewModel(testData.games[3]);
        mockStore.overrideSelector<AppState, Partial<GamePlayState>>(appState.gamePlayState, {
            currentGame: dbModel
        });
        mockStore.refreshState();
        expect(component.earnedBadges).toEqual(dbModel.stats['4kFa6HRvP5OhvYXsH9mEsRrXj4o2'].badge);
        expect(component.earnedBadgesByOtherUser).toEqual([]);

    });

    it('playermode and threeConsecutiveAnswer should be set after the game data is emitted', () => {

        mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {
            user: testData.userList[0]
        });
        const dbModel = Game.getViewModel(testData.games[3]);
        mockStore.overrideSelector<AppState, Partial<GamePlayState>>(appState.gamePlayState, {
            currentGame: dbModel
        });
        mockStore.refreshState();
        expect(component.playerMode).toEqual(dbModel.gameOptions.playerMode);
        expect(component.threeConsecutiveAnswer).toEqual(false);
    });

    it(`threeConsecutiveAnswer should be true set if the game user has given three consecutive answers in
        first turn - it applies to the first user only in a two player game - after the game data is emitted`, () => {

        mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {
            user: testData.userList[0]
        });
        const dbModel = Game.getViewModel(testData.games[17]);
        mockStore.overrideSelector<AppState, Partial<GamePlayState>>(appState.gamePlayState, {
            currentGame: dbModel
        });
        mockStore.refreshState();
        expect(component.threeConsecutiveAnswer).toEqual(true);
    });

    it(`threeConsecutiveAnswer should be false`, () => {

        mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {
            user: testData.userList[0]
        });
        const dbModel = Game.getViewModel(testData.games[18]);
        mockStore.overrideSelector<AppState, Partial<GamePlayState>>(appState.gamePlayState, {
            currentGame: dbModel
        });
        mockStore.refreshState();
        expect(component.threeConsecutiveAnswer).toEqual(false);
    });


    //to do set data for this so we can test it properly
    it(`afterAnswer() function should work correctly if the answer is right`, () => {
        const userDict = {'4kFa6HRvP5OhvYXsH9mEsRrXj4o2': testData.userList[0], 'yP7sLu5TmYRUO9YT4tWrYLAqxSz1': testData.userList[1]};
        const applicationSettings = [];
        applicationSettings.push(testData.applicationSettings);
        const dbModel = Game.getViewModel(testData.games[0]);
        mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {
            userDict: userDict,
            user: testData.userList[0],
            categories: testData.categoryList,
            applicationSettings: applicationSettings
        });

        mockStore.overrideSelector<AppState, Partial<GamePlayState>>(appState.gamePlayState, {
            currentGameQuestion: testData.currentQuestion[0],
            currentGame: dbModel
        });
        mockStore.refreshState();
        const playerQnA: PlayerQnA = {
            playerId: testData.userList[0].userId,
            playerAnswerId: '',
            playerAnswerInSeconds: 11,
            answerCorrect: true,
            questionId: '0hLbLvyErepUWZvCh6wk',
            addedOn: 1590397438000,
            round: 1
          };


        component.setCurrentQuestion(testData.currentQuestion[0]);
        component.MAX_TIME_IN_SECONDS = 16;
        component.timer = 5;
        component.originalAnswers = testData.currentQuestion[0].answers;

        component.afterAnswer(1);
        expect(component.isCorrectAnswer).toEqual(true);
        expect(component.questionAnswered).toEqual(true);
        expect(component.isGameLoaded).toEqual(false);
        // expect(spy).toHaveBeenCalledWith(
        // new gameplayactions.AddPlayerQnA({
        //     gameId: dbModel.gameId,
        //     playerQnA: playerQnA
        //   }));

    });

    it(`afterAnswer() function should work correctly if the answer is wrong`, () => {
        component.setCurrentQuestion(testData.currentQuestion[0]);

        component.timer = 5;
        component.originalAnswers = testData.currentQuestion[0].answers;

        const dbModel = testData.games[0];
        component.game = Game.getViewModel(dbModel);
        component.user = testData.userList[0];
        component.afterAnswer(0);
        expect(component.isCorrectAnswer).toEqual(false);

    });

    // to do
    it(`fillTimer() function should work correctly`, () => {
        component.afterAnswer = jest.fn();
        // component.questionComponent({fillTimer() {}});
        // component.genQuestionComponent.fillTimer = jest.fn();
        component.fillTimer();
        // expect(component.genQuestionComponent.fillTimer).toHaveBeenCalledTimes(1);
        expect(component.afterAnswer).toHaveBeenCalledTimes(1);
    });

    it(`continueGame() function should work correctly`, () => {
        component.setCurrentQuestion = jest.fn();
        component.turnFlag = true;
        component.continueGame();
        expect(component.originalAnswers).toEqual(undefined);
        expect(component.setCurrentQuestion).toHaveBeenCalledTimes(1);
    });

    it(`continueGame() function should work correctly with turnFlag true`, () => {
        const navigate = spyOn(component.router, 'navigate');
        component.turnFlag = true;
        component.continueGame();

        expect(component.continueNext).toEqual(false);
        expect(spy).toHaveBeenNthCalledWith(1, new gameplayactions.ResetCurrentGame());
        expect(spy).toHaveBeenNthCalledWith(2, new gameplayactions.ResetCurrentQuestion());
        expect(spy).toHaveBeenNthCalledWith(3, new gameplayactions.UpdateGameRound('vTzY3HeUvy9lXxaGHa0d'));
        expect(component.showContinueScreen).toEqual(true);
        expect(navigate).toHaveBeenCalledTimes(1);
        expect(navigate).toHaveBeenCalledWith(['/dashboard']);
    });

    it(`continueGame() function should work correctly with isMobile true`, () => {
        const navigate = spyOn(component.router, 'navigate');
        component.isMobile = true;
        component.turnFlag = true;
        component.continueGame();
        expect(navigate).toHaveBeenCalledTimes(0);
    });

    it(`continueGame() function should work correctly with gameOver false`, () => {
        component.checkGameOver = jest.fn();
        component.getLoader = jest.fn();
        component.continueGame();
        component.gameOver = false;
        // something is wrong here
        expect(component.getLoader).toHaveBeenCalledTimes(1);
    });

    it(`continueGame() function should work correctly with turnFlag false`, () => {
        component.checkGameOver = jest.fn();
        const navigate = spyOn(component.router, 'navigate');
        component.turnFlag = false;
        component.continueGame();

        expect(component.questionAnswered).toEqual(false);
        expect(component.showContinueBtn).toEqual(false);
        expect(component.continueNext).toEqual(false);
        expect(component.continueNext).toEqual(false);

        expect(spy).toHaveBeenCalledWith(new gameplayactions.ResetCurrentQuestion());

        expect(component.showContinueScreen).toEqual(true);
        expect(component.checkGameOver).toHaveBeenCalledTimes(1);
        expect(navigate).toHaveBeenCalledTimes(0);
    });
    it(`continueClicked() function should work correctly it should call continueGame function`, () => {
        component.continueGame = jest.fn();
        component.continueClicked({});
        expect(component.continueGame).toHaveBeenCalledTimes(1);
    });

    it(`gameOverButtonClicked() function should work correctly it should call resetValues function and
        gameOverContinueClicked function`, () => {
        component.resetValues = jest.fn();
        component.gameOverContinueClicked = jest.fn();
        component.gameOverButtonClicked({});
        expect(component.showCurrentQuestion).toEqual(false);
        expect(component.resetValues).toHaveBeenCalledTimes(1);
        expect(component.gameOverContinueClicked).toHaveBeenCalledTimes(1);
    });

    afterEach(() => {
        fixture.destroy();
    });

});
