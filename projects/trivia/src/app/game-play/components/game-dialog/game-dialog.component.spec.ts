import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { GameDialogComponent } from './game-dialog.component';
import { NO_ERRORS_SCHEMA, ChangeDetectorRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { Utils } from 'shared-library/core/services';
import { User, Game, PlayerMode, GameStatus, PlayerQnA, Answer } from 'shared-library/shared/model';
import { AppState, appState, categoryDictionary } from '../../../store';
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
                    changeAnswerOrder(answers: Answer[]) {
                       const newAnswer = [];
                       newAnswer[0] = answers[2];
                       newAnswer[1] = answers[0];
                       newAnswer[2] = answers[1];
                       newAnswer[3] = answers[3];
                       return newAnswer;
                    },
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

    it(`verify if threeConsecutiveAnswer is true for game without isBadgeWithCategory is set`, () => {

        mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {
            user: testData.userList[0]
        });
        const dbModel = Game.getViewModel(testData.games[19]);
        mockStore.overrideSelector<AppState, Partial<GamePlayState>>(appState.gamePlayState, {
            currentGame: dbModel
        });
        mockStore.refreshState();
        expect(component.threeConsecutiveAnswer).toEqual(true);
    });

    it(`verify if threeConsecutiveAnswer is false for game without isBadgeWithCategory is set`, () => {

        mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {
            user: testData.userList[0]
        });
        const dbModel = Game.getViewModel(testData.games[20]);
        mockStore.overrideSelector<AppState, Partial<GamePlayState>>(appState.gamePlayState, {
            currentGame: dbModel
        });
        mockStore.refreshState();
        expect(component.threeConsecutiveAnswer).toEqual(false);
    });


    it(`verify if threeConsecutiveAnswer is false for game without isBadgeWithCategory is set`, () => {
        component.isGameLoaded = false;
        mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {
            user: testData.userList[0]
        });
        const dbModel = Game.getViewModel(testData.games[18]);
        mockStore.overrideSelector<AppState, Partial<GamePlayState>>(appState.gamePlayState, {
            currentGame: dbModel
        });
        mockStore.refreshState();
        expect(component.turnFlag).toEqual(false);
    });

    it(`verify if turnFlag is false for game with next round as the currenct user`, () => {
        component.isGameLoaded = false;
        mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {
            user: testData.userList[0]
        });
        const dbModel = Game.getViewModel(testData.games[18]);
        mockStore.overrideSelector<AppState, Partial<GamePlayState>>(appState.gamePlayState, {
            currentGame: dbModel
        });
        mockStore.refreshState();
        expect(component.turnFlag).toEqual(false);
        expect(component.correctAnswerCount).toEqual(2);
        expect(component.totalRound).toEqual(16);
    });

    it(`verify if turnFlag is true for game with next round as not the currenct user`, () => {
        component.setTurnStatusFlag = jest.fn();
        mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {
            user: testData.userList[0]
        });
        const dbModel = Game.getViewModel(testData.games[22]);
        dbModel.gameOver = false;
        mockStore.overrideSelector<AppState, Partial<GamePlayState>>(appState.gamePlayState, {
            currentGame: dbModel
        });
        mockStore.refreshState();
       expect(component.setTurnStatusFlag).toHaveBeenCalledTimes(1);
    });

    it(`verify if setTurnStatusFlag() function works correctly with questionAnswered true`, () => {
        const dbModel = Game.getViewModel(testData.games[18]);
        mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {
            user: testData.userList[0]
        });
        mockStore.overrideSelector<AppState, Partial<GamePlayState>>(appState.gamePlayState, {
            currentGame: dbModel
        });
        mockStore.refreshState();
        component.questionAnswered = true;
        component.setTurnStatusFlag();
       expect(component.isGameLoaded).toEqual(true);
       expect(component.continueNext).toEqual(true);
       expect(component.showContinueBtn).toEqual(true);
    });

    it(`verify if setTurnStatusFlag() function works correctly with questionAnswered false`, () => {
        const dbModel = Game.getViewModel(testData.games[18]);
        mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {
            user: testData.userList[0]
        });
        mockStore.overrideSelector<AppState, Partial<GamePlayState>>(appState.gamePlayState, {
            currentGame: dbModel
        });
        mockStore.refreshState();
        component.questionAnswered = false;
        component.setTurnStatusFlag();
        expect(component.continueNext).toEqual(false);
     });

     // it is failing test it again
     it(`verify if setTurnStatusFlag() function works correctly with gameOver false`, () => {
        component.isGameLoaded = false;
        const dbModel = Game.getViewModel(testData.games[18]);

        mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {
            user: testData.userList[0]
        });
        mockStore.overrideSelector<AppState, Partial<GamePlayState>>(appState.gamePlayState, {
            currentGame: dbModel
        });
        mockStore.refreshState();
        component.questionAnswered = false;
        component.turnFlag = true;
        // component.gameOver = false;
        component.setTurnStatusFlag();
        expect(component.turnFlag).toEqual(true);
        expect(component.continueNext).toEqual(false);

     });

     it(`verify if initializeOtherUser() function works correctly `, () => {
         component.initializeOtherUser();
        expect(component.otherPlayer).toEqual(new User());

     });


     it(`verify if getLoader() function works correctly `, (async() => {
         component.setContinueScreenVisibility = jest.fn();
         component.utils.unsubscribe = jest.fn();
         component.isCorrectAnswer = true;
         component.getLoader(true);
        expect(component.showWinBadge).toEqual(true);
        expect(component.timer).toEqual(2);
        await new Promise((r) => setTimeout(r, 3000));
        expect(component.showWinBadge).toEqual(false);
        expect(component.isCorrectAnswer).toEqual(false);

        expect(component.setContinueScreenVisibility).toHaveBeenCalledTimes(1);
        expect(component.utils.unsubscribe).toHaveBeenCalledTimes(1);

    }));

    it(`verify if getLoader() function works correctly for isCorrectAnswer is false and isLoadContinueScreen is true `, (async() => {
        component.showBadgeScreen = jest.fn();
        component.isCorrectAnswer = false;
        component.getLoader(true);
       expect(component.showBadgeScreen).toHaveBeenCalledTimes(1);

   }));

   it(`verify if getLoader() function works correctly for isCorrectAnswer is false and isLoadContinueScreen is false `, (async() => {
        component.setContinueScreenVisibility = jest.fn();
        component.isCorrectAnswer = false;
        component.getLoader(false);
        expect(component.setContinueScreenVisibility).toHaveBeenCalledTimes(1);

    }));

    it(`verify if showBadgeScreen() function works correctly`, (async() => {

        component.setCurrentQuestion = jest.fn();
        component.showNextBadgeToBeWon = jest.fn();
        mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {
            user: testData.userList[0]
        });

        const dbModel = Game.getViewModel(testData.games[3]);
        mockStore.overrideSelector<AppState, Partial<GamePlayState>>(appState.gamePlayState, {
            currentGame: dbModel,
            currentGameQuestion: testData.currentQuestion[0]
        });
        mockStore.refreshState();
        component.showBadgeScreen();
        expect(component.showLoader).toEqual(true);
        expect(component.timer).toEqual(2);
        await new Promise((r) => setTimeout(r, 2000));
        expect(component.setCurrentQuestion).toHaveBeenCalledTimes(1);
        expect(component.showNextBadgeToBeWon).toHaveBeenCalledTimes(1);

    }));

    it(`verify if showBadgeScreen() function works correctly for isBadgeWithCategory is not defined`, (async() => {

        component.setCurrentQuestion = jest.fn();
        component.showNextBadgeToBeWon = jest.fn();
        mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {
            user: testData.userList[0]
        });

        const dbModel = Game.getViewModel(testData.games[20]);
        mockStore.overrideSelector<AppState, Partial<GamePlayState>>(appState.gamePlayState, {
            currentGame: dbModel,
            currentGameQuestion: testData.currentQuestion[0]
        });
        mockStore.refreshState();
        component.showBadgeScreen();
        expect(component.showLoader).toEqual(true);
        expect(component.timer).toEqual(2);
        await new Promise((r) => setTimeout(r, 2000));
        expect(component.setCurrentQuestion).toHaveBeenCalledTimes(0);
        expect(component.showNextBadgeToBeWon).toHaveBeenCalledTimes(1);

    }));

    it(`verify if showNextBadgeToBeWon() function works correctly with for isBadgeWithCategory true`, (async() => {
        component.subscribeQuestion  = jest.fn();
        component.utils.unsubscribe = jest.fn();
        component.displayQuestionAndStartTimer = jest.fn();
        mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {
            user: testData.userList[0]
        });

        const dbModel = Game.getViewModel(testData.games[0]);
        mockStore.overrideSelector<AppState, Partial<GamePlayState>>(appState.gamePlayState, {
            currentGame: dbModel,
            currentGameQuestion: testData.currentQuestion[0]
        });
        mockStore.refreshState();
        component.showNextBadgeToBeWon();
        expect(component.showLoader).toEqual(false);
        expect(component.timer).toEqual(2);
        expect(component.showBadge).toEqual(true);
        await new Promise((r) => setTimeout(r, 2000));
        expect(component.utils.unsubscribe).toHaveBeenCalledTimes(1);
        expect(component.showBadge).toEqual(false);
        expect(component.subscribeQuestion).toHaveBeenCalledTimes(0);
        expect(component.displayQuestionAndStartTimer).toHaveBeenCalledTimes(1);

    }));

    it(`verify if showNextBadgeToBeWon() function works correctly`, (async() => {
        component.subscribeQuestion  = jest.fn();
        component.utils.unsubscribe = jest.fn();
        mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {
            user: testData.userList[0]
        });

        const dbModel = Game.getViewModel(testData.games[20]);
        mockStore.overrideSelector<AppState, Partial<GamePlayState>>(appState.gamePlayState, {
            currentGame: dbModel,
            currentGameQuestion: testData.currentQuestion[0]
        });
        mockStore.refreshState();
        component.showNextBadgeToBeWon();
        expect(component.showLoader).toEqual(false);
        expect(component.timer).toEqual(2);
        expect(component.showBadge).toEqual(true);
        await new Promise((r) => setTimeout(r, 2000));
        expect(component.utils.unsubscribe).toHaveBeenCalledTimes(1);
        expect(component.showBadge).toEqual(false);
        expect(component.subscribeQuestion).toHaveBeenCalledTimes(1);

    }));


    it(`verify if setContinueScreenVisibility() function works correctly`, () => {
        component.setContinueScreenVisibility(true);
        expect(component.showContinueScreen).toEqual(true);

    });

    it(`verify if continueButtonClicked() function works correctly`, () => {
        component.setContinueScreenVisibility = jest.fn();
        component.getNextQuestion = jest.fn();
        component.showBadgeScreen = jest.fn();
        component.continueButtonClicked();
        expect(component.setContinueScreenVisibility).toHaveBeenCalledTimes(1);
        expect(component.getNextQuestion).toHaveBeenCalledTimes(1);
        expect(component.showBadgeScreen).toHaveBeenCalledTimes(1);

    });

    it(`verify if setCurrentQuestion() function works correctly when value is not passed`, () => {
        component.setCurrentQuestion();
        expect(component.currentQuestion).toEqual(undefined);
        expect(component.showCurrentQuestion).toEqual(false);
    });

    it(`verify if setCurrentQuestion() function works correctly when value is passed`, () => {

        component.setCurrentQuestion(testData.currentQuestion[0]);
        expect(component.currentQuestion).toEqual(testData.currentQuestion[0]);
        expect(component.showCurrentQuestion).toEqual(true);
    });

    it(`verify if subscribeQuestion() function works correctly when value is passed`, () => {
        component.displayQuestionAndStartTimer = jest.fn();
        component.subscribeQuestion();
        expect(component.displayQuestionAndStartTimer).toHaveBeenCalledTimes(1);
    });

    it(`verify if displayQuestionAndStartTimer() function works correctly with question not defined`, () => {
        component.setCurrentQuestion = jest.fn();
        component.displayQuestionAndStartTimer(undefined);
        expect(component.setCurrentQuestion).toHaveBeenCalledTimes(1);
    });

    it(`verify if displayQuestionAndStartTimer() function works correctly with question defined`, (async() => {
        component.setCurrentQuestion = jest.fn();
        component.calculateMaxTime = jest.fn();
        component.fillTimer = jest.fn();
        const dbModel = Game.getViewModel(testData.games[0]);
        categoryDictionary.setResult(testData.categoryDictionary);
        mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {
            user: testData.userList[0],
            categories: testData.categoryList
        });
        mockStore.overrideSelector<AppState, Partial<GamePlayState>>(appState.gamePlayState, {
            currentGameQuestion: testData.currentQuestion[0],
            currentGame: dbModel
        });
        mockStore.refreshState();
        component.currentQuestion = testData.currentQuestion[0];
        component.isQuestionAvailable = false;

        component.displayQuestionAndStartTimer(testData.currentQuestion[0]);
        await new Promise((r) => setTimeout(r, 3000));
        // expect(component.originalAnswers).toEqual({...testData.currentQuestion[0].answers});
        expect(component.calculateMaxTime).toHaveBeenCalledTimes(1);
        expect(component.setCurrentQuestion).toHaveBeenCalledTimes(1);
        expect(component.fillTimer).toHaveBeenCalled();
        expect(component.currentQuestion).toEqual(testData.currentQuestion[0]);

    }));

    it(`verify if displayQuestionAndStartTimer() function works correctly with timeout`, (async() => {
        component.setCurrentQuestion = jest.fn();
        component.calculateMaxTime = jest.fn();
        component.fillTimer = jest.fn();
        const dbModel = Game.getViewModel(testData.games[23]);
        categoryDictionary.setResult(testData.categoryDictionary);
        mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {
            user: testData.userList[0],
            categories: testData.categoryList
        });
        mockStore.overrideSelector<AppState, Partial<GamePlayState>>(appState.gamePlayState, {
            currentGameQuestion: testData.currentQuestion[0],
            currentGame: dbModel
        });
        mockStore.refreshState();
        component.currentQuestion = testData.currentQuestion[0];
        component.isQuestionAvailable = false;
        component.displayQuestionAndStartTimer(testData.currentQuestion[0]);
        await new Promise((r) => setTimeout(r, 100));
        expect(component.currentQuestion).toEqual(testData.currentQuestion[0]);
        expect(component.continueNext).toEqual(true);
        expect(component.showContinueBtn).toEqual(true);
        expect(component.fillTimer).toHaveBeenCalled();

    }));

    it(`calculateMaxTime() function should work correctly`, () => {
        const applicationSettings = [];
        applicationSettings.push(testData.applicationSettings);
        const dbModel = Game.getViewModel(testData.games[0]);
        mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {
            user: testData.userList[0],
            applicationSettings: applicationSettings
        });
        mockStore.overrideSelector<AppState, Partial<GamePlayState>>(appState.gamePlayState, {
            currentGameQuestion: testData.currentQuestion[0],
            currentGame: dbModel
        });
        component.currentQuestion = testData.currentQuestion[0];
        mockStore.refreshState();
        component.calculateMaxTime();
        expect(component.MAX_TIME_IN_SECONDS).toEqual(16);
    });

    it(`getNextQuestion() function should work correctly`, () => {
         const dbModel = Game.getViewModel(testData.games[0]);
         mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {
            user: testData.userList[0]
        });
        mockStore.overrideSelector<AppState, Partial<GamePlayState>>(appState.gamePlayState, {
            currentGame: dbModel
        });
        mockStore.refreshState();
        component.getNextQuestion();
        expect(spy).toHaveBeenCalledWith(
        new gameplayactions.GetNextQuestion(dbModel));
    });

    it(`answerClicked() function should work correctly`, () => {
       component.afterAnswer = jest.fn();
       component.answerClicked(1);
       expect(component.afterAnswer).toHaveBeenCalledTimes(1);
    });

    it(`okClick() function should work correctly`, () => {
        const dbModel = Game.getViewModel(testData.games[0]);
        mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {
            user: testData.userList[0]
        });
        mockStore.overrideSelector<AppState, Partial<GamePlayState>>(appState.gamePlayState, {
            currentGame: dbModel
        });
        mockStore.refreshState();
        component.questionIndex = 9;
        component.okClick({});
        expect(component.gameOver).toEqual(true);
     });

     it(`okClick() function should work correctly with questionIndex less than max question`, () => {
        const dbModel = Game.getViewModel(testData.games[0]);
        mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {
            user: testData.userList[0]
        });
        mockStore.overrideSelector<AppState, Partial<GamePlayState>>(appState.gamePlayState, {
            currentGame: dbModel
        });
        mockStore.refreshState();
        component.questionIndex = 6;
        component.okClick({});
        expect(component.continueNext).toEqual(true);
     });

     it(`gameOverContinueClicked() function should work correctly `, () => {
        component.setCurrentQuestion = jest.fn();
        component.gameOverContinueClicked();
        expect(component.originalAnswers).toEqual(undefined);
        expect(component.questionAnswered).toEqual(false);
        expect(component.showContinueBtn).toEqual(false);

     });

     it(`setGameOver() function should work correctly `, () => {

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
        component.otherPlayerUserId = 'yP7sLu5TmYRUO9YT4tWrYLAqxSz1';
        component.setGameOver();
        expect(component.continueNext).toEqual(false);
        expect(component.isGameLoaded).toEqual(false);
        expect(component.gameOver).toEqual(true);
        expect(component.showWinBadge).toEqual(false);
        expect(spy).toHaveBeenCalledWith(
            new gameplayactions.SetGameOver({
                playedGame: dbModel,
                userId: '4kFa6HRvP5OhvYXsH9mEsRrXj4o2',
                otherUserId: 'yP7sLu5TmYRUO9YT4tWrYLAqxSz1'
              })
        );

     });

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
        expect(component.isCorrectAnswer).toEqual(false);
        expect(component.questionAnswered).toEqual(true);
        expect(component.isGameLoaded).toEqual(false);

    });

    it(`afterAnswer() function should work correctly if the answer is wrong`, () => {
        component.setCurrentQuestion(testData.currentQuestion[0]);

        component.timer = 5;
        component.originalAnswers = testData.currentQuestion[0].answers;

        const dbModel = testData.games[0];
        component.game = Game.getViewModel(dbModel);
        component.user = testData.userList[0];
        component.afterAnswer(0);
        expect(component.isCorrectAnswer).toEqual(true);

    });

    it(`fillTimer() function should work correctly`, () => {
        component.afterAnswer = jest.fn();
        component.fillTimer();
        expect(component.afterAnswer).toHaveBeenCalledTimes(1);
    });

    it(`continueGame() function should work correctly`, () => {
        mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {
            user: testData.userList[0]
        });

        const dbModel = Game.getViewModel(testData.games[0]);
        mockStore.overrideSelector<AppState, Partial<GamePlayState>>(appState.gamePlayState, {
            currentGame: dbModel
        });
        mockStore.refreshState();
        component.setCurrentQuestion = jest.fn();
        component.turnFlag = true;
        component.continueGame();
        expect(component.originalAnswers).toEqual(undefined);
        expect(component.setCurrentQuestion).toHaveBeenCalledTimes(1);
    });

    it(`continueGame() function should work correctly with turnFlag true`, () => {
        mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {
            user: testData.userList[0]
        });

        const dbModel = Game.getViewModel(testData.games[0]);
        mockStore.overrideSelector<AppState, Partial<GamePlayState>>(appState.gamePlayState, {
            currentGame: dbModel
        });
        mockStore.refreshState();
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
        mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {
            user: testData.userList[0]
        });

        const dbModel = Game.getViewModel(testData.games[0]);
        mockStore.overrideSelector<AppState, Partial<GamePlayState>>(appState.gamePlayState, {
            currentGame: dbModel
        });
        mockStore.refreshState();
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


    it(`onDestroy should restore the initial state of the variables`, () => {
        component.utils.unsubscribe = jest.fn();
        component.destroy();
        expect(component.user).toEqual(undefined);
        expect(component.gameObs).toEqual(undefined);
        expect(component.gameQuestionObs).toEqual(undefined);
        expect(component.currentQuestion).toEqual(undefined);
        expect(component.showCurrentQuestion).toEqual(false);

        expect(component.originalAnswers).toEqual([]);
        expect(component.correctAnswerCount).toEqual(undefined);
        expect(component.questionIndex).toEqual(undefined);
        expect(component.timerSub).toEqual(undefined);
        expect(component.questionSub).toEqual(undefined);


        expect(component.categoryName).toEqual(undefined);
        expect(component.continueNext).toEqual(undefined);
        expect(component.questionAnswered).toEqual(undefined);
        expect(component.gameOver).toEqual(undefined);
        expect(component.PlayerMode).toEqual(undefined);



        expect(component.MAX_TIME_IN_SECONDS).toEqual(undefined);
        expect(component.showContinueBtn).toEqual(undefined);
        expect(component.otherPlayer).toEqual(undefined);
        expect(component.otherPlayerUserId).toEqual(undefined);
        expect(component.showBadge).toEqual(undefined);

        expect(component.MAX_TIME_IN_SECONDS_LOADER).toEqual(undefined);
        expect(component.MAX_TIME_IN_SECONDS_BADGE).toEqual(undefined);
        expect(component.showLoader).toEqual(undefined);
        expect(component.showWinBadge).toEqual(undefined);
        expect(component.isCorrectAnswer).toEqual(undefined);
        expect(component.turnFlag).toEqual(undefined);

        expect(component.isQuestionAvailable).toEqual(undefined);
        expect(component.isGameLoaded).toEqual(undefined);
        expect(component.threeConsecutiveAnswer).toEqual(undefined);
        expect(component.currentUTC).toEqual(undefined);
        expect(component.applicationSettings).toEqual(undefined);

        expect(component.genQuestionComponent).toEqual(undefined);
        expect(component.showContinueDialogueForThreeConsecutiveAnswers).toEqual(undefined);

        expect(spy).toHaveBeenCalledWith(new gameplayactions.ResetCurrentGame());
        expect(component.utils.unsubscribe).toHaveBeenCalledTimes(1);
    });

    afterEach(() => {
        fixture.destroy();
    });

});
