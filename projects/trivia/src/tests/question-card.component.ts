import 'reflect-metadata';
import { QuestionCardComponent } from 'shared-library/shared/mobile/component/question-card/question-card.component';
import { nsTestBedBeforeEach, nsTestBedAfterEach, nsTestBedRender } from 'nativescript-angular/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Store, MemoizedSelector } from '@ngrx/store';
import { coreState, CoreState } from 'shared-library/core/store';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { Question } from 'shared-library/shared/model';
import { testData } from 'test/data';

describe('QuestionCardComponent', async () => {

    let component: QuestionCardComponent;
    let fixture: ComponentFixture<QuestionCardComponent>;
    let mockStore: MockStore<CoreState>;
    let mockCoreSelector: MemoizedSelector<CoreState, Partial<CoreState>>;
    const applicationSettings: any[] = [];

    afterAll(() => { });
    beforeEach(nsTestBedBeforeEach([QuestionCardComponent], [

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
        []
    ));
    afterEach(nsTestBedAfterEach());


    beforeEach((async () => {
        fixture = await nsTestBedRender(QuestionCardComponent);
        component = fixture.componentInstance;
        component.question = testData.questionOfTheDay;
        mockStore = TestBed.get(Store);
        mockCoreSelector = mockStore.overrideSelector<CoreState, Partial<CoreState>>(coreState, {});
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

    it('On answerButtonClicked  it should emit given answered and dispatch event to Update Question for wrong answer', () => {
        component.doPlay = true;
        spyOn(component.answerClicked, 'emit');
        component.answerButtonClicked(component.question.answers[0]);
        expect(component.answerClicked.emit).toHaveBeenCalledWith(0);

    });

    it('on ngOnInit call set correct answer', () => {
        spyOn(component.selectedAnswer, 'emit');
        component.ngOnInit();
        expect(component.correctAnswerText).toBe('Object Class');
    });

    it('on call rippleTap it should call answerButtonClicked action and emit selectedAnswer', () => {
        const spyOnAnswerButtonClicked = spyOn(component, 'answerButtonClicked');
        spyOn(component.selectedAnswer, 'emit');
        component.ngOnInit();
        const question: Question = testData.questionOfTheDay;
        component.rippleTap(question.answers[0].answerText);
        expect(spyOnAnswerButtonClicked).toHaveBeenCalledTimes(1);
        expect(component.selectedAnswer.emit).toHaveBeenCalledWith(question.answers[0].answerText);
    });

    it('on call ngOnChanges it should set doPlay flag true', () => {
        const newQuestion = {
            question: {
                previousValue: null,
                currentValue: null,
                firstChange: true,
                isFirstChange: () => true
            }
        };
        component.ngOnChanges(newQuestion);
        expect(component.doPlay).toBeTruthy();
    });

});

