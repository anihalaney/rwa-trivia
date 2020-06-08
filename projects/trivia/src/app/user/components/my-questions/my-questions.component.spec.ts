import { MyQuestionsComponent } from './my-questions.component';
import { ComponentFixture, async, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/compiler/src/core';
import { Store } from '@ngrx/store';
import { AppState, appState } from '../../../store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { QuestionActions, coreState } from 'shared-library/core/store';
import { MatSnackBarModule } from '@angular/material';
import { CoreState } from 'shared-library/core/store';
import { testData } from 'test/data';
import { userState, UserState } from '../../../user/store';
import { User } from 'shared-library/shared/model';

describe('MyQuestionsComponent', () => {
    let component: MyQuestionsComponent;
    let fixture: ComponentFixture<MyQuestionsComponent>;
    let spy: any;
    let publishedQuestions: any;
    let unpublishedQuestions: any;
    let user: User;
    const applicationSettings: any[] = [];
    let mockStore: MockStore<AppState>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [MyQuestionsComponent],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [
                QuestionActions,
                provideMockStore({
                    selectors: [
                        {
                            selector: appState.coreState,
                            value: {}
                        },
                        {
                            selector: userState,
                            value: {}
                        }
                    ]
                })
            ],
            imports: [MatSnackBarModule]
        });
    }));

    beforeEach(() => {
        // Create component
        fixture = TestBed.createComponent(MyQuestionsComponent);
        // mock data
        mockStore = TestBed.get(Store);
        spy = spyOn(mockStore, 'dispatch');
        component = fixture.debugElement.componentInstance;
    });

    it('Should create', () => {
        expect(component).toBeTruthy();
    });

    it('User should be undefined when component is created', () => {
        expect(component.user).toBe(undefined);
    });

    it('user should be set when constructor call', () => {
        user = { ...testData.userList[0] };
        mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {
            user: user
        });
        mockStore.refreshState();
        fixture.detectChanges();
        expect(component.user).toEqual(user);
    });

    it('publishedQuestions should be set when constructor call', () => {
        publishedQuestions = { ...testData.questions.published };
        mockStore.overrideSelector<AppState, Partial<UserState>>(userState, {
            userPublishedQuestions: publishedQuestions
        });
        mockStore.refreshState();
        fixture.detectChanges();
        expect(component.publishedQuestions).toEqual(publishedQuestions);
    });

    it('unpublishedQuestions should be set when constructor call', () => {
        unpublishedQuestions = { ...testData.questions.unpublished };
        mockStore.overrideSelector<AppState, Partial<UserState>>(userState, {
            userUnpublishedQuestions: unpublishedQuestions
        });
        mockStore.refreshState();
        fixture.detectChanges();
        expect(component.unpublishedQuestions).toEqual(unpublishedQuestions);
    });

    it('Verify quillconfig container options should be set when constructor call', () => {
        applicationSettings.push(testData.applicationSettings);
        mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {
            applicationSettings: applicationSettings
        });
        mockStore.refreshState();
        fixture.detectChanges();
        expect(component.quillConfig.toolbar.container[0]).toBe(applicationSettings[0].quill_options.options);
    });

    it('Verify quillconfig container list should be set when constructor call', () => {
        applicationSettings.push(testData.applicationSettings);
        mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {
            applicationSettings: applicationSettings
        });
        mockStore.refreshState();
        fixture.detectChanges();
        expect(component.quillConfig.toolbar.container[1]).toBe(applicationSettings[0].quill_options.list);
    });

    it('Verify quillconfig mathEditor mathOptions should be set when constructor call', () => {
        applicationSettings.push(testData.applicationSettings);
        mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {
            applicationSettings: applicationSettings
        });
        mockStore.refreshState();
        fixture.detectChanges();
        const mathEditorOptions = {
            mathOptions: applicationSettings[0]
        };
        expect(component.quillConfig.mathEditor).toEqual(mathEditorOptions);
    });

    it('Verify hideLoader function works', (async () => {
        component.toggleLoader = jest.fn();
        component.publishedQuestions = { ...testData.questions.published };
        component.unpublishedQuestions = { ...testData.questions.unpublished };
        component.hideLoader();

        await new Promise((r) => setTimeout(r, 2000));
        expect(component.toggleLoader).toHaveBeenCalledTimes(1);
    }));

    it('Verify updateQuestion status, it should be UPDATE', () => {
        component.snackBar.open = jest.fn();
        mockStore.overrideSelector<AppState, Partial<CoreState>>(coreState, {
            updateQuestion: 'UPDATE'
        });
        mockStore.refreshState();
        fixture.detectChanges();
        expect(component.snackBar.open).toHaveBeenCalled();
    });

    it('Verify toggleLoader function', () => {
        component.toggleLoader(true);
        expect(component.loaderBusy).toBe(true);
    });

    it('Verify updateUnpublishedQuestions function', () => {
        unpublishedQuestions = { ...testData.questions.unpublished };
        component.updateUnpublishedQuestions(unpublishedQuestions);
        expect(spy).toHaveBeenCalledWith(
            new QuestionActions().updateQuestion(unpublishedQuestions)
        );
    });

    afterEach(() => {
        fixture.destroy();
    });
});
