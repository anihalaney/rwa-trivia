import 'reflect-metadata';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
    nsTestBedAfterEach,
    nsTestBedBeforeEach,
    nsTestBedRender,
} from 'nativescript-angular/testing';
import { MyQuestionsComponent } from './../app/user/components/my-questions/my-questions.component';
import { StoreModule, Store } from '@ngrx/store';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { testData } from 'test/data';
import { GameActions, QuestionActions, UserActions } from 'shared-library/core/store/actions';
import { RouterTestingModule } from '@angular/router/testing';
import { NativeScriptRouterModule } from 'nativescript-angular/router';
import { User } from 'shared-library/shared/model';
import { AppState, appState } from './../app/store';
import { userState, UserState } from './../app/user/store';
import { Router } from '@angular/router';
import { CoreState } from 'shared-library/core/store';


describe('MyQuestionsComponent', () => {
    let component: MyQuestionsComponent;
    let fixture: ComponentFixture<MyQuestionsComponent>;
    let user: User;
    let router: Router;
    let spy: any;
    let publishedQuestions: any;
    let unpublishedQuestions: any;
    const applicationSettings: any[] = [];
    let mockStore: MockStore<AppState>;

    afterEach(nsTestBedAfterEach());
    beforeEach(nsTestBedBeforeEach(
        [MyQuestionsComponent],
        [GameActions, UserActions, QuestionActions,
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
        [StoreModule.forRoot({}), [RouterTestingModule.withRoutes([]),
        NativeScriptRouterModule.forRoot([])]]
    ));


    beforeEach((async () => {
        fixture = await nsTestBedRender(MyQuestionsComponent);
        mockStore = TestBed.get(Store);
        component = fixture.componentInstance;
        spy = spyOn(mockStore, 'dispatch');
        router = TestBed.get(Router);
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('on Publish tab clicked it should show publish tab', () => {
        component.onSelectTab('published');
        expect(component.tab).toBe('published');
    });

    it('on Unpublished tab clicked it should show unpublished tab', () => {
        component.onSelectTab('unpublished');
        expect(component.tab).toBe('unpublished');
    });

    it('on setSelectedQuestion call it should set the selected question ', () => {
        const question = { ...testData.questions.published[0] };
        component.setSelectedQuestion(question);
        expect(component.selectedQuestion).toEqual(question);

    });

    it('on displayReason call it should set displayReasonViewer and page.actionBarHidden to false  ', () => {
        component.displayReason(false);
        expect(component.displayReasonViewer).toBeFalsy();
        expect(component.page.actionBarHidden).toBeFalsy();
    });


    it('on showUpdateQuestion call it should set displayReasonViewer and displayEditQuestion to false ', () => {
        component.showUpdateQuestion(false);
        expect(component.displayReasonViewer).toBeFalsy();
        expect(component.displayEditQuestion).toBeFalsy();
        expect(component.page.actionBarHidden).toBeTruthy();
    });


    it('on hideQuestion call it should set displayEditQuestion and actionBarHidden false', () => {
        component.hideQuestion();
        expect(component.displayEditQuestion).toBeFalsy();
        expect(component.page.actionBarHidden).toBeFalsy();
    });

    it('on getDisplayStatus call it should get the display status', () => {
        const status = component.getDisplayStatus(0);
        expect(status).toBe('SAVED');
    });

    it('on setTabIndex call it should set tabIndex', () => {
        component.setTabIndex(1);
        expect(component.tabIndex).toBe(1);
    });

    it('On ngOnDestroy called  it should set renderView to false', () => {
        component.ngOnDestroy();
        expect(component.renderView).toBeFalsy();
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
        const spyToggleLoader = spyOn(component, 'toggleLoader');
        component.publishedQuestions = { ...testData.questions.published };
        component.unpublishedQuestions = { ...testData.questions.unpublished };
        component.hideLoader();
        await new Promise((r) => setTimeout(r, 2000));
        expect(spyToggleLoader).toHaveBeenCalledTimes(1);
    }));

    it('Verify toggleLoader function', () => {
        component.toggleLoader(true);
        expect(component.loaderBusy).toBe(true);
    });


});
