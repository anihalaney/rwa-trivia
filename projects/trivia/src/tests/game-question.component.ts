import 'reflect-metadata';
import { GameQuestionComponent } from '../app/game-play/components/game-question/game-question.component.tns';
import { Utils } from 'shared-library/core/services/utils';
import { nsTestBedBeforeEach, nsTestBedAfterEach, nsTestBedRender } from 'nativescript-angular/testing';
import { ComponentFixture, TestBed, tick, fakeAsync, discardPeriodicTasks } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NativeScriptRouterModule } from 'nativescript-angular/router';
import { Router } from '@angular/router';
import { Store, MemoizedSelector } from '@ngrx/store';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { AppState, appState } from './../app/store';
import { testData } from 'test/data';
import { coreState, CoreState, UserActions } from 'shared-library/core/store';
import { User } from 'shared-library/shared/model';

describe('GameQuestionComponent', () => {

    let component: GameQuestionComponent;
    let fixture: ComponentFixture<GameQuestionComponent>;
    let mockStore: MockStore<AppState>;
    let spy: any;
    let router: Router;
    let user: User;
    let mockCoreSelector: MemoizedSelector<CoreState, Partial<CoreState>>;

    afterAll(() => { });
    beforeEach(nsTestBedBeforeEach([GameQuestionComponent], [
        UserActions,
        {
            provide: Utils,
            useValue: {
                getImageUrl(user: User, width: Number, height: Number, size: string) {
                    return `~/assets/images/avatar-${size}.png`;
                }
            }
        },
        provideMockStore({
            selectors: [
                {
                    selector: appState.coreState,
                    value: {}
                }
            ]
        })
    ],
        [RouterTestingModule.withRoutes([]),
        NativeScriptRouterModule.forRoot([])]));


    beforeEach((async () => {
        fixture = await nsTestBedRender(GameQuestionComponent);
        component = fixture.componentInstance;
        mockStore = TestBed.get(Store);
        spy = spyOn(mockStore, 'dispatch');
        router = TestBed.get(Router);
        mockCoreSelector = mockStore.overrideSelector<CoreState, Partial<CoreState>>(coreState, {});
    }));

    afterEach(nsTestBedAfterEach(true));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('on load component, title should set', () => {
        expect(component.actionText).toBe('Playing Now');
    });

    it('fillTimer', () => {
        component.fillTimer();
        expect(component.answeredIndex).toBeUndefined();
        expect(component.progressValue).toBe(100);
    });

    it('Verify getImageUrl function works', () => {
        spy = spyOn(component.utils, 'getImageUrl').and.returnValue('~/assets/images/avatar-400X400.png');
        user = { ...testData.userList[1] };
        component.userDict = { ...testData.userDict };
        const expectedResult = '~/assets/images/avatar-400X400.png';
        expect(component.getImage(user.userId)).toEqual(expectedResult);
    });

    it('Verify load component should set account', () => {
        const account = testData.userList[0].account;
        mockCoreSelector.setResult({ account: account });
        mockStore.refreshState();
        component.ngOnInit();
        expect(component.account).toEqual(account);
    });

    it(`call to checkRoundOver function should emit the gameOverButtonClicked event if gameOver is true`, () => {
        component.gameOver = true;
        const event = '';
        const spyOnGameOver = spyOn(component.gameOverButtonClicked, 'emit');
        component.checkRoundOver(event);
        expect(spyOnGameOver).toHaveBeenCalled();
    });

    // tslint:disable-next-line: max-line-length
    it(`call to checkRoundOver function should emit the btnClickedAfterThreeConsecutiveAnswers event if threeConsecutiveAnswer is true`, () => {
        component.threeConsecutiveAnswer = true;
        const event = '';
        const spyOnbtnClickedAfterThreeConsecutiveAnswers = spyOn(component.btnClickedAfterThreeConsecutiveAnswers, 'emit');
        component.checkRoundOver(event);
        expect(spyOnbtnClickedAfterThreeConsecutiveAnswers).toHaveBeenCalled();
    });

    it(`call to ngOnChanges it should set progressValue 100 if game is continue and answer index is not set`, () => {
        component.continueNext = true;
        component.answeredIndex = undefined;
        component.ngOnChanges({
            any: {
                previousValue: undefined,
                currentValue: undefined,
                firstChange: undefined,
                isFirstChange: undefined
            }
        });
        expect(component.progressValue).toBe(100);
    });

    it(`call to ngOnChanges it should set progressValue 100 if game is continue and answer index is not set`, () => {
        component.continueNext = true;
        component.answeredIndex = undefined;
        component.ngOnChanges({
            any: {
                previousValue: undefined,
                currentValue: undefined,
                firstChange: undefined,
                isFirstChange: undefined
            }
        });
        expect(component.progressValue).toBe(100);
    });

    it(`call to ngOnChanges it should call continueButtonClicked function when game is not over`, () => {
        component.showLoader = true;
        component.gameOver = false;
        const spyOnContinueButtonClicked = spyOn(component, 'continueButtonClicked');
        component.ngOnChanges({
            showContinueBtn: {
                previousValue: undefined,
                currentValue: true,
                firstChange: true,
                isFirstChange: () => true
            }
        });
        expect(spyOnContinueButtonClicked).toHaveBeenCalled();
    });

    it(`call to ngOnChanges it should emit gameOverButtonClicked event when game is over`, () => {
        component.showLoader = true;
        component.gameOver = true;
        const spyOnGameOverButtonClicked = spyOn(component.gameOverButtonClicked, 'emit');
        component.ngOnChanges({
            showContinueBtn: {
                previousValue: undefined,
                currentValue: true,
                firstChange: true,
                isFirstChange: () => true
            }
        });
        expect(spyOnGameOverButtonClicked).toHaveBeenCalled();
    });

    it(`call to ngOnChanges it should emit gameOverButtonClicked event when game is over and value change showCurrentQuestion `, () => {
        component.showLoader = true;
        const spyOnGameOverButtonClicked = spyOn(component.gameOverButtonClicked, 'emit');
        component.ngOnChanges({
            showCurrentQuestion: {
                previousValue: undefined,
                currentValue: true,
                firstChange: true,
                isFirstChange: () => true
            }
        });
        expect(spyOnGameOverButtonClicked).toHaveBeenCalled();
    });

    // tslint:disable-next-line: max-line-length
    it(`call to ngOnChanges it should emit btnClickedAfterThreeConsecutiveAnswers event when game is over and value change threeConsecutiveAnswer `, () => {
        component.showLoader = true;
        const spyOnBtnClickedAfterThreeConsecutiveAnswers = spyOn(component.btnClickedAfterThreeConsecutiveAnswers, 'emit');
        component.ngOnChanges({
            threeConsecutiveAnswer: {
                previousValue: undefined,
                currentValue: true,
                firstChange: true,
                isFirstChange: () => true
            }
        });
        expect(spyOnBtnClickedAfterThreeConsecutiveAnswers).toHaveBeenCalled();
    });

    it(`call to ngOnChanges it should emit gameOverButtonClicked event when game is over and value change gameOver `, () => {
        component.showLoader = true;
        const spyOnGameOverButtonClicked = spyOn(component.gameOverButtonClicked, 'emit');
        component.ngOnChanges({
            gameOver: {
                previousValue: undefined,
                currentValue: true,
                firstChange: true,
                isFirstChange: () => true
            }
        });
        expect(spyOnGameOverButtonClicked).toHaveBeenCalled();
    });

    it(`call to ngOnChanges it set timer and progressValue`, () => {

        component.MAX_TIME_IN_SECONDS = 32;
        component.ngOnChanges({
            timer: {
                previousValue: 26,
                currentValue: 25,
                firstChange: false,
                isFirstChange: () => true
            }
        });
        expect(component.timer).toBe(7);
        expect(component.progressValue).toBe(21.875);
    });

    it(`call to ngOnChanges it set increment timer and progressValue `, fakeAsync(() => {

        component.MAX_TIME_IN_SECONDS = 32;
        component.ngOnChanges({
            timer: {
                previousValue: 26,
                currentValue: 25,
                firstChange: false,
                isFirstChange: () => true
            }
        });
        tick(90);
        expect(component.timer).toBe(7.099999999999998);
        expect(component.progressValue).toBe(22.187499999999993);

        // This will discard old period task. we have to do this here because we have used tick so test timer
        discardPeriodicTasks();
    }));

    it('verify doPlay should be true initially', () => {
        expect(component.doPlay).toBe(true);
    });

    it('verify if answerButtonClicked() function works correctly with already selected answer', () => {
        spyOn(component.answerClicked, 'emit');
        component.answeredIndex = 0;
        component.answerButtonClicked(testData.questions.published[0].answers[1], 1);
        expect(component.answerClicked.emit).toHaveBeenCalledTimes(0);
    });

    it('verify if answerButtonClicked() function works correctly with continueNext true', () => {
        spyOn(component.answerClicked, 'emit');
        component.continueNext = true;
        component.answerButtonClicked(testData.questions.published[0].answers[1], 1);
        expect(component.answerClicked.emit).toHaveBeenCalledTimes(0);
    });

    it('verify if answerButtonClicked() function works correctly with doPlay false', () => {
        spyOn(component.answerClicked, 'emit');
        component.doPlay = false;
        component.answerButtonClicked(testData.questions.published[0].answers[1], 1);
        expect(component.answerClicked.emit).toHaveBeenCalledTimes(0);
    });

    it('verify if answerButtonClicked() function works correctly with doPlay true', () => {
        spyOn(component.answerClicked, 'emit');
        component.answerButtonClicked(testData.questions.published[0].answers[1], 1);
        expect(component.answeredText).toEqual(testData.questions.published[0].answers[1].answerText);
        expect(component.doPlay).toEqual(false);
        expect(component.answeredIndex).toEqual(1);
        expect(component.answerClicked.emit).toHaveBeenCalledTimes(1);
    });

    it('verify if disableQuestions() function works correctly', () => {
        component.disableQuestions(1);
        expect(component.doPlay).toEqual(false);
        expect(component.correctAnswerIndex).toEqual(1);
    });

    it('verify if continueButtonClicked() function works correctly with showContinueBtn is true', () => {
        component.showContinueBtn = true;
        spyOn(component.continueClicked, 'emit');
        component.continueButtonClicked({});
        expect(component.showLoader).toEqual(true);
        expect(component.continueClicked.emit).toHaveBeenCalledTimes(1);
    });

    it('verify if continueButtonClicked() function works correctly with showContinueBtn is false', () => {
        component.showContinueBtn = false;
        spyOn(component.continueClicked, 'emit');
        component.continueButtonClicked({});
        expect(component.showLoader).toEqual(true);
        expect(component.continueClicked.emit).toHaveBeenCalledTimes(0);
    });

});

