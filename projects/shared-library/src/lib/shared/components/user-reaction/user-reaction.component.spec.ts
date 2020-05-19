import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { StoreModule, MemoizedSelector, Store } from '@ngrx/store';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { coreState, CoreState, UserActions, ActionWithPayload } from 'shared-library/core/store';
import { GameActions, UIStateActions } from 'shared-library/core/store/actions';
import { AuthenticationProvider } from 'shared-library/core/auth';
import { Utils, WindowRef } from 'shared-library/core/services';
import { MatSnackBarModule } from '@angular/material';
import { testData } from 'test/data';
import { UserReactionComponent } from './user-reaction.component';
import { SimpleChange } from '@angular/core';


describe('UserReactionComponent', () => {
    let component: UserReactionComponent;
    let fixture: ComponentFixture<UserReactionComponent>;
    let mockStore: MockStore<CoreState>;
    let spy: any;

    let mockCoreSelector: MemoizedSelector<CoreState, Partial<CoreState>>;
    beforeEach(async(() => {

        TestBed.configureTestingModule({
            imports: [ReactiveFormsModule, FormsModule, StoreModule.forRoot({}), MatSnackBarModule],
            providers: [
                {
                    provide: AuthenticationProvider, useValue: {
                        ensureLogin() {
                            return true;
                        }
                    }
                },
                provideMockStore({
                    initialState: {},
                    selectors: [
                        {
                            selector: coreState,
                            value: {}
                        }
                    ]
                }),
                UserActions,
                GameActions,
                UIStateActions,
                Utils,
                WindowRef],
            declarations: [UserReactionComponent]
        });

        fixture = TestBed.createComponent(UserReactionComponent);
        mockStore = TestBed.get(Store);
        component = fixture.componentInstance;

        mockCoreSelector = mockStore.overrideSelector<CoreState, Partial<CoreState>>(coreState, {});
        spy = spyOn(mockStore, 'dispatch');
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('Initial value of the subscriptions should be truthy and userReactionStatus should be should be falsy', () => {
        expect(component.subscriptions).toBeTruthy();
        expect(component.userReactionStatus).toBeFalsy();
    });

    it(`set userReactionStatus when store emit getUserReactionStatus`, () => {
        mockCoreSelector.setResult({ getUserReactionStatus: { status: 'like' } });
        mockStore.refreshState();
        expect(component.userReactionStatus).toEqual({ status: 'like' });
    });

    it('set question when store emit getQuestionSuccess', () => {
        mockCoreSelector.setResult({ getQuestionSuccess: testData.questions.published[0] });
        mockStore.refreshState();
        expect(component.question).toEqual(testData.questions.published[0]);
    });

    it('call to userReaction function it should call ensureLogin function when user is not logged ins', () => {

        const spyAuthService = spyOn(component.authService, 'ensureLogin').and.callThrough();
        expect(spyAuthService);
        component.userReaction('like');
        expect(component.authService.ensureLogin).toHaveBeenCalled();

    });

    it('call to userReaction should dispatch User Reaction event when user is logged in', () => {
        const question = testData.questions.published[0];
        component.question = question;
        component.user = testData.userList[0];

        const payload = {
            questionId: component.question.id,
            userId: component.user.userId,
            status: 'like'
        };

        spy.and.callFake((action: ActionWithPayload<any>) => {
            expect(action.type).toEqual(GameActions.USER_REACTION);
            expect(action.payload).toEqual(payload);
        });

        component.userReaction('like');
        expect(mockStore.dispatch).toHaveBeenCalled();
    });

    it('call to getUserReaction it should dispatch the Get UserReaction action', () => {
        component.question = testData.questions.published[0];
        component.user = testData.userList[0];

        spy.and.callFake((action: ActionWithPayload<any>) => {
            expect(action.type).toEqual(GameActions.GET_USER_REACTION);
            expect(action.payload).toEqual({ questionId: component.question.id, userId: component.user.userId });
        });
        component.getUserReaction();
        expect(mockStore.dispatch).toHaveBeenCalled();
    });


    it('call to GetQuestion should dispatch the GetQuestion action', () => {
        component.question = testData.questions.published[0];
        component.user = testData.userList[0];

        spy.and.callFake((action: ActionWithPayload<any>) => {
            expect(action.type).toEqual(GameActions.GET_QUESTION);
            expect(action.payload).toEqual(component.question.id);
        });

        component.getQuestion();
        expect(mockStore.dispatch).toHaveBeenCalled();
    });

    it('ngOnChanges should be called', () => {

        const spyGetUserReaction = spyOn(component, 'getUserReaction').and.callThrough();
        const spyGetQuestion = spyOn(component, 'getQuestion').and.callThrough();

        expect(spyGetUserReaction);
        expect(spyGetQuestion);

        component.question = testData.questions.published[0];
        component.user = testData.userList[0];

        component.ngOnChanges({
            changes: new SimpleChange(null, null, null)
        });

        expect(component.getQuestion).toHaveBeenCalled();
        expect(component.getUserReaction).toHaveBeenCalled();
    });

});

