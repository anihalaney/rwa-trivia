import 'reflect-metadata';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
    nsTestBedAfterEach,
    nsTestBedBeforeEach,
    nsTestBedRender,
} from 'nativescript-angular/testing';
import { ReportGameComponent } from '../app/game-play/components/report-game/report-game.component.tns';
import { StoreModule, Store, MemoizedSelector } from '@ngrx/store';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { CoreState } from 'shared-library/core/store';
import { testData } from 'test/data';
import { RouterTestingModule } from '@angular/router/testing';
import { NativeScriptRouterModule } from 'nativescript-angular/router';
import { User, Game, Question, ReportQuestion, QuestionMetadata } from 'shared-library/shared/model';
import { AppState, appState } from '../app/store';
import { Router } from '@angular/router';
import { UserActions } from 'shared-library/core/store/actions';
import { Utils } from 'shared-library/core/services';
import { categoryDictionary } from 'shared-library/core/store';
import * as gameplayactions from '../app/game-play/store/actions';

describe('ReportGameComponent', () => {
    let component: ReportGameComponent;
    let fixture: ComponentFixture<ReportGameComponent>;
    let router: Router;
    let spy: any;
    let mockStore: MockStore<AppState>;
    let mockCoreSelector: MemoizedSelector<AppState, Partial<CoreState>>;

    afterEach(nsTestBedAfterEach());
    beforeEach(nsTestBedBeforeEach(
        [ReportGameComponent],
        [UserActions,
            Utils,
            provideMockStore({
                initialState: {},
                selectors: [
                    {
                        selector: appState.coreState,
                        value: {
                        }
                    }
                ]
            }),
        ],
        [StoreModule.forRoot({}), [RouterTestingModule.withRoutes([]),
        NativeScriptRouterModule.forRoot([])]]
    ));
    beforeEach((async () => {
        fixture = await nsTestBedRender(ReportGameComponent);
        mockStore = TestBed.get(Store);
        component = fixture.componentInstance;
        mockCoreSelector = mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {});
        spy = spyOn(mockStore, 'dispatch');
        router = TestBed.get(Router);
        fixture.detectChanges();
        component.user = { ...testData.userList[0] },
            component.question = testData.question,
            component.game = Game.getViewModel(testData.games[0]),
            component.userDict = { '4kFa6HRvP5OhvYXsH9mEsRrXj4o2': { ...testData.userList[0] } };
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('On load component should set categoryDict when categoryDictionary emitted', () => {
        categoryDictionary.setResult(testData.categoryDictionary);
        mockStore.refreshState();
        fixture.detectChanges();
        expect(component.categoryDict).toEqual(testData.categoryDictionary);

    });

    it('on click selectReasons it should set true in list for report options', () => {
        component.selectReasons(1);
        expect(component.reportOptions[1].selected).toBeTruthy();
    });

    it('on click selectReasons it should set true in list for report options', () => {
        component.selectReasons(1);
        expect(component.reportOptions[1].selected).toBeTruthy();
    });

    it('on ccloseDialogReport', () => {
        const onSpyGenerateNewReport = spyOn(component, 'generateNewReportOptions').and.returnValue('');
        spyOn(component.closePopUp, 'emit');
        component.closeDialogReport();
        expect(onSpyGenerateNewReport).toHaveBeenCalledTimes(1);
        expect(component.closePopUp.emit).toHaveBeenCalledTimes(1);
    });

    it('on otherAnswer it should return incorrect answers', () => {
        const otherAnswer = component.otherAnswer;
        expect(otherAnswer.length).toBe(3);
    });

    it('on otherAnswer it should return correct answers', () => {
        const otherAnswer = component.correctAnswer;
        expect(otherAnswer.length).toBe(1);
    });

    it('on otherAnswer it should return correct answers', () => {
        component.categoryDict = testData.categoryDictionary;
        const category = component.categoryName;
        expect(category).toEqual('Bit of sci-fi');
    });

    it(`on hideKeyboard it should hide keyboard`, () => {
        const services = TestBed.get(Utils);
        const spyOnHideKeyboard = spyOn(services, 'hideKeyboard');
        component.hideKeyboard();
        expect(spyOnHideKeyboard).toHaveBeenCalled();
    });

    it(`on click generateNewReportOptions it should generate report Options`, () => {
        component.generateNewReportOptions();
        expect(component.reportOptions.length).toBe(7);
    });

    it(`Verify saveReportQuestion function when user selected other reason for report a question`, () => {
        categoryDictionary.setResult(testData.categoryDictionary);
        mockStore.refreshState();
        fixture.detectChanges();
        component.reportOptions[0].selected = true;

        const user: User = { ...testData.userList[0] };
        const question: Question = testData.question;
        const dbModel = testData.games[0];
        const game: Game = Game.getViewModel(dbModel);
        const reportQuestion = new ReportQuestion();
        const reasons: string[] = [];
        reasons.push('Offensive content');
        const info: { [key: string]: QuestionMetadata } = {};
        const questionMetadata = new QuestionMetadata();
        questionMetadata.reasons = reasons;

        info[question.id] = { ...questionMetadata };
        reportQuestion.gameId = game.gameId;
        reportQuestion.created_uid = user.userId;
        reportQuestion.questions = info;
        component.saveReportQuestion();

        expect(spy).toHaveBeenCalledWith(
            new gameplayactions.SaveReportQuestion({ reportQuestion: reportQuestion, game: game })
        );
    });

    it(`Verify saveReportQuestion function when user did not selected other reason for report a question`, () => {

        categoryDictionary.setResult(testData.categoryDictionary);
        mockStore.refreshState();
        fixture.detectChanges();
        component.reportOptions[6].selected = true;
        component.otherReason = 'Wrong answer';

        const user: User = { ...testData.userList[0] };
        const question: Question = testData.question;
        const dbModel = testData.games[0];
        const game: Game = Game.getViewModel(dbModel);
        const reportQuestion = new ReportQuestion();
        const reasons: string[] = [];
        reasons.push('Wrong answer');
        const info: { [key: string]: QuestionMetadata } = {};
        const questionMetadata = new QuestionMetadata();
        questionMetadata.reasons = reasons;

        info[question.id] = { ...questionMetadata };
        reportQuestion.gameId = game.gameId;
        reportQuestion.created_uid = user.userId;
        reportQuestion.questions = info;
        component.saveReportQuestion();
        expect(spy).toHaveBeenCalledWith(
            new gameplayactions.SaveReportQuestion({ reportQuestion: reportQuestion, game: game })
        );
    });

    it(`Verify saveReportQuestion function if reason is not passed then it should show error message`, () => {
        categoryDictionary.setResult(testData.categoryDictionary);
        mockStore.refreshState();
        fixture.detectChanges();
        component.reportOptions[6].selected = true;

        const services = TestBed.get(Utils);
        const spyMessage = spyOn(services, 'showMessage');

        component.saveReportQuestion();
        expect(spyMessage).toHaveBeenCalled();
    });

});
