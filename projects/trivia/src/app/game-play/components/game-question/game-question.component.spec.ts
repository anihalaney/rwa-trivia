import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { GameQuestionComponent } from './game-question.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Store, MemoizedSelector } from '@ngrx/store';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { Utils } from 'shared-library/core/services';
import { User, Game, PlayerMode, GameStatus } from 'shared-library/shared/model';
import { AppState, appState } from '../../../store';
import { testData } from 'test/data';
import { CoreState } from 'shared-library/core/store';
import { MatSnackBarModule } from '@angular/material';

describe('GameQuestionComponent', () => {

    let component: GameQuestionComponent;
    let fixture: ComponentFixture<GameQuestionComponent>;
    let spy: any;
    let user: User;
    let mockStore: MockStore<AppState>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [GameQuestionComponent],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [
                {provide: Utils, useValue: {
                    getTimeDifference(turnAt: number) {
                        return 1588313130838 - turnAt;
                    },
                    convertIntoDoubleDigit(digit: Number) {
                        return (digit < 10) ? `0${digit}` : `${digit}`;
                    }
                }},
                provideMockStore( {
                    selectors: [
                      {
                        selector: appState.coreState,
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
        fixture = TestBed.createComponent(GameQuestionComponent);
        // mock data
        mockStore = TestBed.get(Store);
        spy = spyOn(mockStore, 'dispatch');

        component = fixture.debugElement.componentInstance;

        const dbModel = testData.games[0];
        component.game = Game.getViewModel(dbModel);

    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
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


    afterEach(() => {
        fixture.destroy();
    });

});
