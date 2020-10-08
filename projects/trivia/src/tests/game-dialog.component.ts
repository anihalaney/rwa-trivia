import 'reflect-metadata';
import { ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import {
    nsTestBedAfterEach,
    nsTestBedBeforeEach,
    nsTestBedRender,
} from 'nativescript-angular/testing';
import { GameDialogComponent } from '../app/game-play/components/game-dialog/game-dialog.component.tns';
import { StoreModule, Store, MemoizedSelector } from '@ngrx/store';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { CoreState, UserActions, GameActions } from 'shared-library/core/store';
import { testData } from 'test/data';
import { RouterTestingModule } from '@angular/router/testing';
import { NativeScriptRouterModule } from 'nativescript-angular/router';
import { User, Game, PlayerQnA, Answer } from 'shared-library/shared/model';
import { AppState, appState, categoryDictionary } from '../app/store';
import { Router } from '@angular/router';
import { Utils } from 'shared-library/core/services';
import { gamePlayState, GamePlayState } from '../app/game-play/store';
import { ApplicationEventData } from 'tns-core-modules/application';
import cloneDeep from 'lodash/cloneDeep';
import * as gameplayactions from '../app/game-play/store/actions';
import { Subscription } from 'rxjs';

describe('GameDialogComponent', () => {
    let component: GameDialogComponent;
    let fixture: ComponentFixture<GameDialogComponent>;
    let router: Router;
    let spy: any;
    let mockStore: MockStore<AppState>;
    let mockCoreSelector: MemoizedSelector<AppState, Partial<CoreState>>;


    afterEach(nsTestBedAfterEach());
    beforeEach(nsTestBedBeforeEach(
        [GameDialogComponent],
        [
            provideMockStore({
                initialState: {},
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
            }),
            {
                provide: Utils, useValue: {
                    changeAnswerOrder(answers: Answer[]) {
                        return answers;
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
                    },
                    getUTCTimeStamp() {
                        return 1594635139000;
                    }
                }
            },
            GameActions,
            UserActions
        ],
        [StoreModule.forRoot({}), [RouterTestingModule.withRoutes([]),
        NativeScriptRouterModule.forRoot([])]]
    ));
    beforeEach((async () => {
        fixture = await nsTestBedRender(GameDialogComponent);
        mockStore = TestBed.get(Store);
        component = fixture.componentInstance;
        mockCoreSelector = mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {});
        spy = spyOn(mockStore, 'dispatch');
        router = TestBed.get(Router);
        component.MAX_TIME_IN_SECONDS = 16;
        fixture.detectChanges();
    }));


    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should create', () => {
        expect(component.isMobile).toBeTruthy();
    });

    it('on call suspendCallBack it should get current utc timestamp', () => {

        const services = TestBed.get(Utils);
        const spyOnGetUTCTimeStamp = spyOn(services, 'getUTCTimeStamp').and.returnValue(1594635139000);
        const args: ApplicationEventData = {
            eventName: 'suspendCallBack',
            object: {}
        };
        component.suspendCallBack(args);
        expect(component.suspendTime).toBe(1594635139000);
    });

    it('on call resumeCallBack it should unsubscribe subscriber', () => {
        const services = TestBed.get(Utils);
        const spyOnGetUTCTimeStamp = spyOn(services, 'getUTCTimeStamp').and.returnValue(1594635139000);
        const spyOnUnsubscribe = spyOn(services, 'unsubscribe').and.returnValue('');
        mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {
            user: testData.userList[0]
        });
        const game = testData.games[0];
        const dbModel = Game.getViewModel(game);
        mockStore.overrideSelector<AppState, Partial<GamePlayState>>(appState.gamePlayState, {
            currentGame: dbModel
        });
        mockStore.refreshState();
        const args: ApplicationEventData = {
            eventName: 'resumeCallBack',
            object: {},
            ios: true
        };
        component.resumeCallBack(args);
        expect(component.resumeTime).toBe(1594635139000);
        expect(spyOnUnsubscribe).toHaveBeenCalledTimes(1);
    });



    it('on call resumeCallBack it should display 0 time of remain to give answer', () => {

        const services = TestBed.get(Utils);
        const spyOnGetUTCTimeStamp = spyOn(services, 'getUTCTimeStamp').and.returnValue(1594635139000);
        const spyOnUnsubscribe = spyOn(services, 'unsubscribe').and.returnValue('');
        mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {
            user: testData.userList[0]
        });
        const game = cloneDeep(testData.games[0]);
        game.playerQnAs[game.playerQnAs.length - 1].answerCorrect = undefined;
        const dbModel = Game.getViewModel(game);
        mockStore.overrideSelector<AppState, Partial<GamePlayState>>(appState.gamePlayState, {
            currentGame: dbModel
        });
        mockStore.refreshState();
        const args: ApplicationEventData = {
            eventName: 'resumeCallBack',
            object: {},
            ios: true
        };
        component.suspendTime = 1594635129000;
        component.timer = 6;
        component.resumeCallBack(args);
        expect(component.timer).toBe(0);

    });


    it('on call resumeCallBack it should display remain time of question complete', () => {

        const services = TestBed.get(Utils);
        const spyOnGetUTCTimeStamp = spyOn(services, 'getUTCTimeStamp').and.returnValue(1594635139000);
        const spyOnUnsubscribe = spyOn(services, 'unsubscribe').and.returnValue('');
        mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {
            user: testData.userList[0]
        });
        const game = cloneDeep(testData.games[0]);
        game.playerQnAs[game.playerQnAs.length - 1].answerCorrect = undefined;
        const dbModel = Game.getViewModel(game);
        mockStore.overrideSelector<AppState, Partial<GamePlayState>>(appState.gamePlayState, {
            currentGame: dbModel
        });
        mockStore.refreshState();
        const args: ApplicationEventData = {
            eventName: 'resumeCallBack',
            object: {},
            ios: true
        };
        component.suspendTime = 1594635129000;
        component.timer = 13;
        component.resumeCallBack(args);
        expect(component.timer).toBe(3);

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


    it(`verify if initializeOtherUser() function works correctly `, () => {
        component.initializeOtherUser();
        expect(component.otherPlayer).toEqual(new User());

    });

    it(`verify if getLoader() function works correctly `, (async () => {
        const spyOnSetContinueScreenVisibility = spyOn(component, 'setContinueScreenVisibility');
        const services = TestBed.get(Utils);
        const spyOnGetUTCTimeStamp = spyOn(services, 'unsubscribe');
        component.isCorrectAnswer = true;
        component.getLoader(true);
        expect(component.showWinBadge).toEqual(true);
        expect(component.timer).toEqual(2);
        await new Promise((r) => setTimeout(r, 3000));
        expect(component.showWinBadge).toEqual(false);
        expect(component.isCorrectAnswer).toEqual(false);

        expect(spyOnSetContinueScreenVisibility).toHaveBeenCalledTimes(1);
        expect(spyOnGetUTCTimeStamp).toHaveBeenCalledTimes(1);

    }));

    it(`verify if getLoader() function works correctly for isCorrectAnswer is false and isLoadContinueScreen is true `, (async () => {
        const spyOnShowBadgeScreen = spyOn(component, 'showBadgeScreen');
        component.isCorrectAnswer = false;
        component.getLoader(true);
        expect(spyOnShowBadgeScreen).toHaveBeenCalledTimes(1);

    }));

    it(`verify if getLoader() function works correctly for isCorrectAnswer is false and isLoadContinueScreen is false `, (async () => {
        const spyOnSetContinueScreenVisibility = spyOn(component, 'setContinueScreenVisibility');
        component.isCorrectAnswer = false;
        component.getLoader(false);
        expect(spyOnSetContinueScreenVisibility).toHaveBeenCalledTimes(1);

    }));


    it(`verify if showBadgeScreen() function works correctly`, (async () => {

        const spyOnSetCurrentQuestion = spyOn(component, 'setCurrentQuestion');
        const spyOnShowNextBadgeToBeWon = spyOn(component, 'showNextBadgeToBeWon');
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
        expect(spyOnSetCurrentQuestion).toHaveBeenCalledTimes(1);
        expect(spyOnShowNextBadgeToBeWon).toHaveBeenCalledTimes(1);

    }));

    it(`verify if showBadgeScreen() function works correctly for isBadgeWithCategory is not defined`, (async () => {

        const spyOnSetCurrentQuestion = spyOn(component, 'setCurrentQuestion');
        const spyOnShowNextBadgeToBeWon = spyOn(component, 'showNextBadgeToBeWon');
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
        expect(spyOnSetCurrentQuestion).toHaveBeenCalledTimes(0);
        expect(spyOnShowNextBadgeToBeWon).toHaveBeenCalledTimes(1);

    }));

    it(`verify if setContinueScreenVisibility() function works correctly`, () => {
        component.setContinueScreenVisibility(true);
        expect(component.showContinueScreen).toEqual(true);
    });

    it(`verify if continueButtonClicked() function works correctly`, () => {
        const spyOnSetContinueScreenVisibility = spyOn(component, 'setContinueScreenVisibility');
        const spyOnGetNextQuestion = spyOn(component, 'getNextQuestion');
        const spyOnShowBadgeScreen = spyOn(component, 'showBadgeScreen');
        component.continueButtonClicked();
        expect(spyOnSetContinueScreenVisibility).toHaveBeenCalledTimes(1);
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
        const spyOnDisplayQuestionAndStartTimer = spyOn(component, 'displayQuestionAndStartTimer');
        component.subscribeQuestion();
        expect(spyOnDisplayQuestionAndStartTimer).toHaveBeenCalledTimes(1);
    });

    it(`verify if displayQuestionAndStartTimer() function works correctly with question not defined`, () => {
        const spyOnSetCurrentQuestion = spyOn(component, 'setCurrentQuestion');
        component.displayQuestionAndStartTimer(undefined);
        expect(spyOnSetCurrentQuestion).toHaveBeenCalledTimes(1);
    });

    it(`verify if displayQuestionAndStartTimer() function works correctly with question defined`, (async () => {

        const spyOnSetCurrentQuestion = spyOn(component, 'setCurrentQuestion');
        const spyOnCalculateMaxTime = spyOn(component, 'calculateMaxTime');
        const spyOnFillTimer = spyOn(component, 'fillTimer');

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
        expect(spyOnCalculateMaxTime).toHaveBeenCalledTimes(1);
        expect(spyOnSetCurrentQuestion).toHaveBeenCalledTimes(1);
        expect(spyOnFillTimer).toHaveBeenCalled();
        expect(component.currentQuestion).toEqual(testData.currentQuestion[0]);

    }));

    it(`verify if displayQuestionAndStartTimer() function works correctly with timeout`, (async () => {

        const spyOnFillTimer = spyOn(component, 'fillTimer');
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
        expect(spyOnFillTimer).toHaveBeenCalled();
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
        const spyOnAfterAnswer = spyOn(component, 'afterAnswer');
        component.answerClicked(1);
        expect(spyOnAfterAnswer).toHaveBeenCalledTimes(1);
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
        const spyOnSetCurrentQuestion = spyOn(component, 'setCurrentQuestion');
        component.gameOverContinueClicked();
        expect(component.originalAnswers).toEqual(undefined);
        expect(component.questionAnswered).toEqual(false);
        expect(component.showContinueBtn).toEqual(false);
        expect(spyOnSetCurrentQuestion).toHaveBeenCalledTimes(1);
    });

    it(`setGameOver() function should work correctly `, () => {
        const userDict = { '4kFa6HRvP5OhvYXsH9mEsRrXj4o2': testData.userList[0], 'yP7sLu5TmYRUO9YT4tWrYLAqxSz1': testData.userList[1] };
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
        const userDict = { '4kFa6HRvP5OhvYXsH9mEsRrXj4o2': testData.userList[0], 'yP7sLu5TmYRUO9YT4tWrYLAqxSz1': testData.userList[1] };
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

        component.afterAnswer(0);
        expect(component.isCorrectAnswer).toEqual(false);
        expect(component.questionAnswered).toEqual(true);
        expect(component.isGameLoaded).toEqual(false);
    });

    it(`afterAnswer() function should work correctly if the answer is wrong`, () => {

        component.setCurrentQuestion(testData.currentQuestion[0]);
        component.timer = 5;
        component.originalAnswers = cloneDeep(testData.currentQuestion[0].answers);
        const dbModel = testData.games[0];
        component.game = Game.getViewModel(dbModel);
        component.user = testData.userList[0];
        component.afterAnswer(1);
        expect(component.isCorrectAnswer).toEqual(true);
    });

    it(`fillTimer() function should work correctly`, () => {
        const spyOnAfterAnswer = spyOn(component, 'afterAnswer');
        component.fillTimer();
        expect(spyOnAfterAnswer).toHaveBeenCalledTimes(1);
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
        const spyOnSetCurrentQuestion = spyOn(component, 'setCurrentQuestion');
        component.turnFlag = true;
        component.continueGame();
        expect(component.originalAnswers).toEqual(undefined);
        expect(spyOnSetCurrentQuestion).toHaveBeenCalledTimes(1);
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

        component.turnFlag = true;
        component.continueGame();

        expect(component.continueNext).toEqual(false);
        expect(spy).toHaveBeenCalledWith(new gameplayactions.ResetCurrentGame());
        expect(spy).toHaveBeenCalledWith(new gameplayactions.ResetCurrentQuestion());
        expect(spy).toHaveBeenCalledWith(new gameplayactions.UpdateGameRound('vTzY3HeUvy9lXxaGHa0d'));
        expect(component.showContinueScreen).toEqual(true);

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
        const spyOnCheckGameOver = spyOn(component, 'checkGameOver');
        const spyOnGetLoader = spyOn(component, 'getLoader');
        component.continueGame();
        component.gameOver = false;
        expect(spyOnGetLoader).toHaveBeenCalledTimes(1);
    });

    it(`continueGame() function should work correctly with turnFlag false`, () => {
        const spyOnCheckGameOver = spyOn(component, 'checkGameOver');
        const navigate = spyOn(component.router, 'navigate');
        component.turnFlag = false;
        component.continueGame();

        expect(component.questionAnswered).toEqual(false);
        expect(component.showContinueBtn).toEqual(false);
        expect(component.continueNext).toEqual(false);
        expect(component.continueNext).toEqual(false);

        expect(spy).toHaveBeenCalledWith(new gameplayactions.ResetCurrentQuestion());

        expect(component.showContinueScreen).toEqual(true);
        expect(spyOnCheckGameOver).toHaveBeenCalledTimes(1);
        expect(navigate).toHaveBeenCalledTimes(0);
    });

    it(`continueClicked() function should work correctly it should call continueGame function`, () => {
        const spyOnContinueGame = spyOn(component, 'continueGame');
        component.continueClicked({});
        expect(spyOnContinueGame).toHaveBeenCalledTimes(1);
    });

    it(`gameOverButtonClicked() function should work correctly it should call resetValues function and
        gameOverContinueClicked function`, () => {

        const spyOnResetValues = spyOn(component, 'resetValues');
        const spyOnGameOverContinueClicked = spyOn(component, 'gameOverContinueClicked');
        component.gameOverButtonClicked({});
        expect(component.showCurrentQuestion).toEqual(false);
        expect(spyOnResetValues).toHaveBeenCalledTimes(1);
        expect(spyOnGameOverContinueClicked).toHaveBeenCalledTimes(1);
    });

    it(`onDestroy should restore the initial state of the variables`, () => {
        const services = TestBed.get(Utils);
        const spyOnUnsubscribe = spyOn(services, 'unsubscribe');

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
        expect(spyOnUnsubscribe).toHaveBeenCalledTimes(1);
    });

});
