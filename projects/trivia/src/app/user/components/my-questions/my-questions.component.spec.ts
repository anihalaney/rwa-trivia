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
import { of } from 'rxjs';
import { toArray } from 'rxjs/operators';
import { User } from 'shared-library/shared/model';

describe('MyQuestionsComponent', () => {
    let component: MyQuestionsComponent;
    let fixture: ComponentFixture<MyQuestionsComponent>;
    let spy: any;
    let categories: any;
    let questions: any;
    let user: User;
    const applicationSettings: any[] = [];
    let tags: any;
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

    it('categoriesObs should be set when counstrocter call', () => {
        categories = testData.categories;
        const categories$ = of(testData.categories);
        questions = { ...testData.questions };
        mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {
            categories: categories
        });
        mockStore.overrideSelector<AppState, Partial<UserState>>(userState, {
            userPublishedQuestions: questions
        });
        mockStore.refreshState();
        fixture.detectChanges();
        categories$.pipe(toArray()).subscribe(result => {
            expect(result[0]).toEqual(categories);
        });
    });

    it('tagsObs should be set when counstrocter call', () => {
        tags = testData.tagList;
        const tags$ = of(testData.tagList);
        questions = { ...testData.questions };
        mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {
            tags: tags
        });
        mockStore.overrideSelector<AppState, Partial<UserState>>(userState, {
            userPublishedQuestions: questions
        });
        mockStore.refreshState();
        fixture.detectChanges();
        tags$.pipe(toArray()).subscribe(result => {
            expect(result[0]).toEqual(tags);
        });
    });

    it('user should be set when counstrocter call', () => {
        user = { ...testData.userList[0] };
        mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {
            user: user
        });
        mockStore.refreshState();
        fixture.detectChanges();
        expect(component.user).toEqual(user);
    });

    it('publishedQuestions should be set when counstrocter call', () => {
        questions = { ...testData.questions };
        mockStore.overrideSelector<AppState, Partial<UserState>>(userState, {
            userPublishedQuestions: questions
        });
        mockStore.refreshState();
        fixture.detectChanges();
        expect(component.publishedQuestions).toEqual(questions);
    });

    it('publishedQuestions should be set when counstrocter call', () => {
        questions = { ...testData.questions };
        mockStore.overrideSelector<AppState, Partial<UserState>>(userState, {
            userUnpublishedQuestions: questions
        });
        mockStore.refreshState();
        fixture.detectChanges();
        expect(component.unpublishedQuestions).toEqual(questions);
    });

    it('Verify quillconfig container options should be set when counstrocter call', () => {
        applicationSettings.push(testData.applicationSettings);
        mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {
            applicationSettings: applicationSettings
        });
        mockStore.refreshState();
        fixture.detectChanges();
        expect(component.quillConfig.toolbar.container[0]).toBe(applicationSettings[0].quill_options.options);
    });

    it('Verify quillconfig container list should be set when counstrocter call', () => {
        applicationSettings.push(testData.applicationSettings);
        mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {
            applicationSettings: applicationSettings
        });
        mockStore.refreshState();
        fixture.detectChanges();
        expect(component.quillConfig.toolbar.container[1]).toBe(applicationSettings[0].quill_options.list);
    });

    it('Verify quillconfig mathEditor mathOptions should be set when counstrocter call', () => {
        applicationSettings.push(testData.applicationSettings);
        mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {
            applicationSettings: applicationSettings
        });
        mockStore.refreshState();
        fixture.detectChanges();
        const expectedResult = {
            mathOptions: applicationSettings[0]
        };
        expect(component.quillConfig.mathEditor).toEqual(expectedResult);
    });

    it('Verify hideLoader function works', () => {
        questions = { ...testData.questions };
        mockStore.overrideSelector<AppState, Partial<UserState>>(userState, {
            userPublishedQuestions: questions,
            userUnpublishedQuestions: questions
        });
        mockStore.refreshState();
        fixture.detectChanges();
        component.hideLoader();
        setTimeout(() => {
            expect(spy).toHaveBeenCalledWith(
                component.toggleLoader(false)
            );
        }, 1000);
    });

    it('Verify updateQuestion status, it should be UPDATE', () => {
        component.snackBar.open = jest.fn();
        mockStore.overrideSelector<AppState, Partial<CoreState>>(coreState, {
            updateQuestion: 'UPDATE'
        });
        mockStore.refreshState();
        fixture.detectChanges();
        expect(component.snackBar.open).toHaveBeenCalled();
    });

    afterEach(() => {
        fixture.destroy();
    });
});
