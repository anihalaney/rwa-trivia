import 'reflect-metadata';
import { QuestionsTableComponent } from 'shared-library/shared/mobile/component/question-table/questions-table.component';
import { nsTestBedBeforeEach, nsTestBedAfterEach, nsTestBedRender } from 'nativescript-angular/testing';
import { ComponentFixture,  tick, fakeAsync } from '@angular/core/testing';
import {  Question } from 'shared-library/shared/model';
import { testData } from 'test/data';
import { isIOS } from 'tns-core-modules/ui/page/page';

describe('QuestionsTableComponent', async () => {

    let component: QuestionsTableComponent;
    let fixture: ComponentFixture<QuestionsTableComponent>;

    afterAll(() => { });
    beforeEach(nsTestBedBeforeEach([QuestionsTableComponent], [
    ],
        []
    ));
    afterEach(nsTestBedAfterEach());

    beforeEach((async () => {
        fixture = await nsTestBedRender(QuestionsTableComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('on expandQuestion it should set all questions and set show question which id is passed', fakeAsync(() => {
        const spyOnScrollToIndex = spyOn(component, 'scrollToIndex').and.callFake(() => null);
        const questions = testData.questions.unpublished;
        component.questions = questions;
        component.expandQuestion(questions[0].id, true, 1);
        tick(1);
        expect(component.questions[0]['show']).toBeTruthy();
        expect(component.questions.length).toBe(4);
        if (isIOS) {
            expect(spyOnScrollToIndex).toHaveBeenCalledTimes(1);
        }
    }));

    it('on setHeight it should set all height of question', () => {

        const questions = testData.questions.unpublished;
        const question = questions[0];
        component.questions = questions;
        component.setHeight(200, question.id);
        expect(component.questions[0]['height']).toBe(200);

    });

    it('on setAnsHeight it should set all height of answer', () => {
        const questions = testData.questions.unpublished;
        const question = questions[0];
        component.questions = questions;
        component.setAnsHeight(200, question.id, 0, 0);
        expect(component.questions[0].answers[0]['height']).toBe(200);
    });

    it('on hideData it should hide question', () => {
        component.hideData();
        expect(component.showQuestionId).toBe('');
    });
    it('on getDisplayStatus it should return status of question in string', () => {
        const status = component.getDisplayStatus(0);
        expect(status).toBe('SAVED');
    });

    it('on getOtherOptionsString it should return all wrong answer with comma separator', () => {
        const questions = testData.questions.unpublished;
        const question = questions[0];
        const answers = component.getOtherOptionsString(question.answers);
        expect(answers).toBe('push(),reduce(),reduceRight()');
    });

    it('on showReason it should emit question and reason', () => {
        spyOn(component.displayReason, 'next');
        const questions = testData.questions.unpublished;
        const question = questions[0];
        spyOn(component.selectedQuestion, 'next');
        component.showReason(question);
        expect(component.displayReasonViewer).toBeTruthy();
        expect(component.displayReason.next).toHaveBeenCalled();
        expect(component.selectedQuestion.next).toHaveBeenCalled();
    });

    it('on showEditQuestion it should emit edit question', () => {
        const questions = testData.questions.unpublished;
        const question: Question = questions[0];
        const spyOnCalled = spyOn(component.editQuestion, 'next');
        component.showEditQuestion(question);
        fixture.detectChanges();
        expect(spyOnCalled).toHaveBeenCalled();
    });


    it('on call ngOnChanges it should set show false to all question', () => {
        const questions = testData.questions.unpublished;
        component.questions = questions;
        const newQuestions = {
            questions: {
                previousValue: null,
                currentValue: questions,
                firstChange: true,
                isFirstChange: () => true
            }
        };
        component.ngOnChanges(newQuestions);
        expect(component.questions[0]['show']).toBeFalsy();

    });


});
