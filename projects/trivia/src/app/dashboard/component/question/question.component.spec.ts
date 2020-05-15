import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { QuestionComponent } from './question.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Store } from '@ngrx/store';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { Utils } from 'shared-library/core/services';
import { Answer } from 'shared-library/shared/model';
import { AppState, appState } from '../../../store';
import { testData } from 'test/data';
import { MatSnackBarModule } from '@angular/material';
import { QuestionActions } from 'shared-library/core/store/actions';
import { GameActions } from 'shared-library/core/store/actions';
import { CoreState } from 'shared-library/core/store';

describe('QuestionComponent', () => {

    let component: QuestionComponent;
    let fixture: ComponentFixture<QuestionComponent>;
    let spy: any;
    let mockStore: MockStore<AppState>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [QuestionComponent],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [
                QuestionActions,
                GameActions,
                {
                    provide: Utils, useValue: {
                    changeAnswerOrder(answers: Answer[]) {
                        if (answers) {
                            const tempAnswers = [...answers];
                            answers[3] = tempAnswers[0];
                            answers[2] = tempAnswers[2];
                            answers[1] = tempAnswers[3];
                            answers[0] = tempAnswers[1];
                          }
                          return answers;
                    }
                }},
                provideMockStore( {
                   initialState: {},
                    selectors: [
                      {
                        selector: appState.coreState,
                        value: {
                        }
                      }
                    ]
                  })
            ],
            imports: [ MatSnackBarModule ]
        });

    }));

    beforeEach(() => {
        // create component
        fixture = TestBed.createComponent(QuestionComponent);
        // mock data
        mockStore = TestBed.get(Store);
        spy = spyOn(mockStore, 'dispatch');

        component = fixture.debugElement.componentInstance;

    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('Initial value of the data should be falsy', () => {
        expect(component.answeredText).toBeFalsy();
        expect(component.correctAnswerText).toBeFalsy();
        expect(component.doPlay).toBeTruthy();
    });

    it('category dictionary and question of the day should be empty', () => {
        mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {
            categories: []
          });
        mockStore.refreshState();
        fixture.detectChanges();
        expect(component.categoryDictionary).toBeFalsy();
        expect(component.question).toBeFalsy();
    });

    it('category dictionary and question of the day should be same as emitted value', () => {
        mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {
            categories: testData.categoryList,
            questionOfTheDay: testData.questionOfTheDay
          });
        mockStore.refreshState();
        fixture.detectChanges();
        expect(component.categoryDictionary).toEqual(testData.categoryDictionary);
        expect(component.question).toEqual(testData.questionOfTheDay);
    });


    it('answer\'s order should be changed for question of the day', () => {
        mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {
            categories: testData.categoryList,
            questionOfTheDay: testData.questionOfTheDay
          });
        mockStore.refreshState();
        fixture.detectChanges();

        const question = testData.questionOfTheDay;

        const tempAnswers = [...question.answers];
        question.answers[3] = tempAnswers[0];
        question.answers[2] = tempAnswers[2];
        question.answers[1] = tempAnswers[3];
        question.answers[0] = tempAnswers[1];
        expect(component.question.answers).toEqual(question.answers);
    });


    it('Verify Correct answer', () => {
        mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {
            categories: testData.categoryList,
            questionOfTheDay: testData.questionOfTheDay
          });
        mockStore.refreshState();
        fixture.detectChanges();

        expect(component.correctAnswerText).toEqual('Object Class');
    });

    it('Verify category name is set from the question categories', () => {
        mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {
            categories: testData.categoryList,
            questionOfTheDay: testData.questionOfTheDay
          });
        mockStore.refreshState();
        fixture.detectChanges();

        const categoryName = testData.questionOfTheDay.categoryIds.map(category => {
            if (testData.categoryDictionary[category]) {
              return testData.categoryDictionary[category].categoryName;
            } else {
              return '';
            }
          })
            .join(',');
        expect(component.categoryName).toEqual(categoryName);
    });

    it('verify selectedAnswer function', () => {
        mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {
            categories: testData.categoryList,
            questionOfTheDay: testData.questionOfTheDay
          });
        mockStore.refreshState();
        fixture.detectChanges();
        component.selectedAnswer(testData.questionOfTheDay.answers[1]);
        expect(component.answeredText).toEqual(testData.questionOfTheDay.answers[1].answerText);
    });

    it('verify rippleTap function works', () => {
        component.answerButtonClicked = jest.fn();
        mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {
            categories: testData.categoryList,
            questionOfTheDay: testData.questionOfTheDay
          });
        mockStore.refreshState();
        fixture.detectChanges();
        component.rippleTap(testData.questionOfTheDay.answers[1]);
        expect(component.answerButtonClicked).toHaveBeenCalledTimes(1);
    });

    it('verify getNextQuestion function works', () => {
        mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {
            categories: testData.categoryList,
            questionOfTheDay: testData.questionOfTheDay
          });
        mockStore.refreshState();
        fixture.detectChanges();
        component.getNextQuestion();
        expect(component.answeredText).toBeFalsy();
        expect(component.correctAnswerText).toBeFalsy();
    });

    it('verify get Next Question action dispatches correctly', async () => {
      mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {
          categories: testData.categoryList,
          questionOfTheDay: testData.questionOfTheDay
        });
      mockStore.refreshState();
      fixture.detectChanges();

      component.getNextQuestion();

      expect(spy).toHaveBeenCalledWith(
          new QuestionActions().getQuestionOfTheDay()
        );
    });

    it('verify answerButtonClicked function should work and  answerClicked event should emit the correct index', async () => {
      spyOn(component.answerClicked, 'emit');
      mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {
          categories: testData.categoryList,
          questionOfTheDay: testData.questionOfTheDay
        });
      mockStore.refreshState();
      fixture.detectChanges();

      component.answerButtonClicked(testData.questionOfTheDay.answers[1]);
      expect(component.doPlay).toBeFalsy();
      expect(component.answeredText).toEqual(testData.questionOfTheDay.answers[1].answerText);
      expect(component.answerClicked.emit).toBeCalledWith(1);
    });

    it('verify answerButtonClicked function should not work if doPlay is false', async () => {
      spyOn(component.answerClicked, 'emit');
      mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {
          categories: testData.categoryList,
          questionOfTheDay: testData.questionOfTheDay
        });
      mockStore.refreshState();
      fixture.detectChanges();
      component.doPlay = false;
      component.answerButtonClicked(testData.questionOfTheDay.answers[1]);
      expect(component.answerClicked.emit).toBeCalledTimes(0);
    });

    it('verify if the answer is correct UpdateQuestionStat action should fire with \'correct\' argument', async () => {

      mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {
          categories: testData.categoryList,
          questionOfTheDay: testData.questionOfTheDay
        });
      mockStore.refreshState();
      fixture.detectChanges();
      component.answerButtonClicked(testData.questionOfTheDay.answers[2]);
      expect(spy).toHaveBeenCalledWith(
        new GameActions().UpdateQuestionStat(testData.questionOfTheDay.id, 'CORRECT')
      );
    });

    it('verify if the answer is wrong UpdateQuestionStat action should fire with \'wrong\' argument', async () => {

      mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {
          categories: testData.categoryList,
          questionOfTheDay: testData.questionOfTheDay
        });
      mockStore.refreshState();
      fixture.detectChanges();
      component.answerButtonClicked(testData.questionOfTheDay.answers[1]);
      expect(spy).toHaveBeenCalledWith(
        new GameActions().UpdateQuestionStat(testData.questionOfTheDay.id, 'WRONG')
      );
    });

    afterEach(() => {
        fixture.destroy();
    });

});
