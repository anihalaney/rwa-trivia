import 'reflect-metadata';
import { FirstQuestionComponent } from 'shared-library/shared/mobile/component/first-question/first-question.component';
import { Utils } from 'shared-library/core/services/utils';
import { nsTestBedBeforeEach, nsTestBedAfterEach, nsTestBedRender } from 'nativescript-angular/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { NativeScriptRouterModule } from 'nativescript-angular/router';
import { StoreModule, Store, MemoizedSelector } from '@ngrx/store';
// tslint:disable-next-line: max-line-length
import { coreState, CoreState, UserActions, UIStateActions, GameActions, categoryDictionary, ActionWithPayload } from 'shared-library/core/store';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { User, Answer } from 'shared-library/shared/model';
import { testData } from 'test/data';
import { Router } from '@angular/router';

describe('FirstQuestionComponent', async () => {

    let component: FirstQuestionComponent;
    let fixture: ComponentFixture<FirstQuestionComponent>;
    let user: User;
    let mockStore: MockStore<CoreState>;
    let mockCoreSelector: MemoizedSelector<CoreState, Partial<CoreState>>;
    const applicationSettings: any[] = [];
    let spy: any;
    let router: Router;

    afterAll(() => { });
    beforeEach(nsTestBedBeforeEach([FirstQuestionComponent], [
        {
            provide: Utils,
            useValue: {
                showMessage(type: string, message: string) { },
                changeAnswerOrder(answers: Answer[]) {
                    return answers;
                }
            }
        },
        FormBuilder,
        UserActions,
        GameActions,
        UIStateActions,
        provideMockStore({
            initialState: {},
            selectors: [
                {
                    selector: coreState,
                    value: {}
                }
            ]
        }),
    ],
        [StoreModule.forRoot({}), [RouterTestingModule.withRoutes([]),
        NativeScriptRouterModule.forRoot([])]]
    ));
    afterEach(nsTestBedAfterEach());

    beforeEach((async () => {
        fixture = await nsTestBedRender(FirstQuestionComponent);
        component = fixture.componentInstance;
        mockStore = TestBed.get(Store);
        mockCoreSelector = mockStore.overrideSelector<CoreState, Partial<CoreState>>(coreState, {});
        spy = spyOn(mockStore, 'dispatch');
        router = TestBed.get(Router);
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });


    it('on load component should set applicationSettings', () => {
        applicationSettings.push(testData.applicationSettings);
        mockCoreSelector.setResult({ applicationSettings });
        mockStore.refreshState();
        fixture.detectChanges();
        expect(component.applicationSettings).toEqual(applicationSettings[0]);
    });

    it('on load component should set categoryDictionary', () => {
        categoryDictionary.setResult(testData.categoryDictionary);
        mockStore.refreshState();
        expect(component.categoryDictionary).toBe(testData.categoryDictionary);
    });

    it('on load component should set set question, categoryDictionary and categoryName and correctAnswerText ', () => {

        const questionOfTheDay = testData.questionOfTheDay;
        categoryDictionary.setResult(testData.categoryDictionary);
        mockCoreSelector.setResult({ firstQuestion: questionOfTheDay });
        mockStore.refreshState();
        expect(component.categoryDictionary).toBe(testData.categoryDictionary);
        expect(component.categoryName).toBe('Bit of fact');
        expect(component.correctAnswerText).toBe('Object Class');
        expect(component.question).not.toBeNull();
    });

    it('On load component should set redirect to app-invite-friends-dialog when store emit firstQuestionBits  ', () => {
        user = { ...testData.userList[0] };
        component.user = user;
        const firstQuestionBits = 'First question assigned successfully';
        mockCoreSelector.setResult({ firstQuestionBits: firstQuestionBits });
        const navigateSpy = spyOn(router, 'navigate');
        mockStore.refreshState();
        fixture.detectChanges();
        expect(navigateSpy).toHaveBeenCalledWith(['/user/my/app-invite-friends-dialog', { showSkip: true }], undefined);
    });
    it('On load component should set userDict when store emit userDict ', () => {
        user = { ...testData.userList[0] };
        const userDict = { '4kFa6HRvP5OhvYXsH9mEsRrXj4o2': user };
        mockCoreSelector.setResult({ userDict });
        mockStore.refreshState();
        fixture.detectChanges();
        expect(component.userDict).toEqual(userDict);
    });

    it('On answerButtonClicked  it should emit given answered and dispatch event to Update Question for wrong answer', () => {

        spyOn(component.answerClicked, 'emit');
        const question = testData.questionOfTheDay;

        const payload = { questionId: question.id, type: 'WRONG' };
        spy.and.callFake((action: ActionWithPayload<string>) => {
            expect(action.type).toEqual(GameActions.UPDATE_QUESTION_STAT);
            expect(action.payload).toEqual(payload);
        });

        categoryDictionary.setResult(testData.categoryDictionary);
        mockCoreSelector.setResult({ firstQuestion: question });
        mockStore.refreshState();
        component.answerButtonClicked(question.answers[0]);
        expect(component.answerClicked.emit).toHaveBeenCalledWith(0);

    });

    it('On answerButtonClicked it should emit given answered and dispatch event to Update Question for right answer', () => {

        spyOn(component.answerClicked, 'emit');
        const question = testData.questionOfTheDay;

        const payload = { questionId: question.id, type: 'CORRECT' };
        spy.and.callFake((action: ActionWithPayload<string>) => {
            expect(action.type).toEqual(GameActions.UPDATE_QUESTION_STAT);
            expect(action.payload).toEqual(payload);
        });

        categoryDictionary.setResult(testData.categoryDictionary);
        mockCoreSelector.setResult({ firstQuestion: question });
        mockStore.refreshState();
        component.answerButtonClicked(question.answers[2]);
        expect(component.answerClicked.emit).toHaveBeenCalledWith(2);
    });

    it('On click ripple tap it should call answerButtonClicked', () => {
        const spyOnRippleTap = spyOn(component, 'answerButtonClicked');
        const answer = 'Object Class';
        component.rippleTap(answer);
        expect(spyOnRippleTap).toHaveBeenCalledTimes(1);
    });

    it('On click ripple tap it should call answerButtonClicked', () => {
        const question = testData.questionOfTheDay;
        component.selectedAnswer(question.answers[2]);
        expect(component.answeredText).toBe('Object Class');
    });

    it('On click goToNextStep tap with correct answer it should dispatch action for add first bits for correct answer', () => {
        const question = testData.questionOfTheDay;
        component.correctAnswerText = question.answers[2].answerText;
        component.answeredText = question.answers[2].answerText;
        component.user = testData.userList[0];
        const payload = testData.userList[0].userId;
        spy.and.callFake((action: ActionWithPayload<string>) => {
            expect(action.type).toEqual(UserActions.SET_FIRST_QUESTION_BITS);
            expect(action.payload).toEqual(payload);
        });

        component.goToNextStep('continue');
        expect(component.answeredText).toBe(question.answers[2].answerText);
        expect(spy).toHaveBeenCalledWith({ type: 'SET_FIRST_QUESTION_BITS', payload: '4kFa6HRvP5OhvYXsH9mEsRrXj4o2' });

    });

    it('On click goToNextStep tap with wrong answer it should call redirect to app-invite friends dialog', () => {
        const question = testData.questionOfTheDay;
        component.correctAnswerText = question.answers[2].answerText;
        component.answeredText = question.answers[0].answerText;
        component.user = testData.userList[0];
        const navigateSpy = spyOn(router, 'navigate');
        component.goToNextStep('continue');
        expect(navigateSpy).toHaveBeenCalledWith(['/user/my/app-invite-friends-dialog', { showSkip: true }], undefined);

    });

    it('On click goToNextStep tap for skip the question then it should call redirect to app-invite friends dialog', () => {
        const question = testData.questionOfTheDay;
        component.correctAnswerText = question.answers[2].answerText;
        component.answeredText = question.answers[0].answerText;
        component.user = testData.userList[0];
        const navigateSpy = spyOn(router, 'navigate');
        component.goToNextStep('skip');
        expect(component.answeredText).toBe(question.answers[0].answerText);
        expect(navigateSpy).toHaveBeenCalledWith(['/user/my/app-invite-friends-dialog', { showSkip: true }], undefined);

    });


});
