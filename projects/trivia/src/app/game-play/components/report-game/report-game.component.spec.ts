import { ReportGameComponent } from './report-game.component';
import { ComponentFixture, async, TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { AppState, appState } from '../../../store';
import { User, ReportQuestion, QuestionMetadata, Game, Question } from 'shared-library/shared/model';
import { Store } from '@ngrx/store';
import { categoryDictionary } from 'shared-library/core/store';
import { NO_ERRORS_SCHEMA } from '@angular/compiler/src/core';
import { Utils, WindowRef } from 'shared-library/core/services';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule, MAT_DIALOG_DATA } from '@angular/material';
import { testData } from 'test/data';
import * as gameplayactions from '../../store/actions';

describe('ReportGameComponent', () => {
    let component: ReportGameComponent;
    let fixture: ComponentFixture<ReportGameComponent>;
    let spy: any;
    let mockStore: MockStore<AppState>;

    beforeEach(async(() => {
        // create new instance of FormBuilder
        const formBuilder: FormBuilder = new FormBuilder();

        TestBed.configureTestingModule({
            declarations: [ReportGameComponent],
            schemas: [NO_ERRORS_SCHEMA],
            imports: [ReactiveFormsModule, FormsModule, MatSnackBarModule],
            providers: [
                Utils,
                WindowRef,
                { provide: FormBuilder, useValue: formBuilder },
                {
                    provide: MAT_DIALOG_DATA, useValue: {
                        user: { ...testData.userList[0] },
                        question: testData.question,
                        game: Game.getViewModel(testData.games[0]),
                        userDict: { '4kFa6HRvP5OhvYXsH9mEsRrXj4o2': { ...testData.userList[0] } }
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
            ]
        });
    }));

    beforeEach(() => {
        // create component
        fixture = TestBed.createComponent(ReportGameComponent);
        // mock data
        mockStore = TestBed.get(Store);
        spy = spyOn(mockStore, 'dispatch');
        component = fixture.debugElement.componentInstance;
    });

    it('Should create', () => {
        expect(component).toBeTruthy();
    });

    it('reportQuestion initial value should be undefined', () => {
        expect(component.reportQuestion).toBeUndefined();
    });

    it('Verify initial value of user, question, userDict and game. It should not be undefined', () => {
        expect(component.user).not.toBeUndefined();
        expect(component.question).not.toBeUndefined();
        expect(component.userDict).not.toBeUndefined();
        expect(component.game).not.toBeUndefined();
    });

    it('On load component should set categoryDict when categoryDictionary emitted', () => {
        categoryDictionary.setResult(testData.categoryDictionary);
        mockStore.refreshState();
        fixture.detectChanges();

        expect(component.categoryDict).toEqual(testData.categoryDictionary);
    });

    it('Verify createForm function works correctly', () => {
        categoryDictionary.setResult(testData.categoryDictionary);
        mockStore.refreshState();
        fixture.detectChanges();
        const reportQuestion = new ReportQuestion();
        component.createForm(reportQuestion);

        expect(component.reportQuestionForm.get('reason').value).not.toBeUndefined();
        expect(component.reportQuestionForm.get('otherReason').value).not.toBeUndefined();
    });

    it('Verify if the closeModel function works', (async () => {
        component.ref = { close: function () { } };
        component.ref.close = jest.fn();
        component.closeModel();
        expect(component.ref.close).toHaveBeenCalledTimes(1);
    }));

    it('Verify saveReportQuestion function when user selected other reason for report a question', () => {
        categoryDictionary.setResult(testData.categoryDictionary);
        mockStore.refreshState();
        fixture.detectChanges();
        component.reportQuestionForm.get('reason').setValue('other');
        component.reportQuestionForm.get('otherReason').setValue('This is wrong question');
        const user: User = { ...testData.userList[0] };
        const question: Question = testData.question;
        const dbModel = testData.games[0];
        const game: Game = Game.getViewModel(dbModel);
        const reportQuestion = new ReportQuestion();
        const reasons: string[] = [];
        reasons.push(component.reportQuestionForm.get('otherReason').value);
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

    it('Verify saveReportQuestion function when user did not selected other reason for report a question', () => {
        categoryDictionary.setResult(testData.categoryDictionary);
        mockStore.refreshState();
        fixture.detectChanges();
        component.reportQuestionForm.get('reason').setValue('Wrong answer');
        const user: User = { ...testData.userList[0] };
        const question: Question = testData.question;
        const dbModel = testData.games[0];
        const game: Game = Game.getViewModel(dbModel);
        const reportQuestion = new ReportQuestion();
        const reasons: string[] = [];
        reasons.push(component.reportQuestionForm.get('reason').value);
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
});
