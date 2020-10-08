import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RejectedQuestionContentComponent } from './rejected-question-content.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { testData } from 'test/data';
import { Question } from 'shared-library/shared/model';


describe('RejectedQuestionContentComponent', () => {
    let component: RejectedQuestionContentComponent;
    let fixture: ComponentFixture<RejectedQuestionContentComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            schemas: [NO_ERRORS_SCHEMA],
            imports: [],
            declarations: [RejectedQuestionContentComponent]
        });

        fixture = TestBed.createComponent(RejectedQuestionContentComponent);
        component = fixture.componentInstance;

        const question: Question = testData.questions.published[0];
        component.rejectQuestion = question;
        component.rejectQuestion.reason = '';
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('Initial value of the data should be falsy', () => {
        expect(component.reasonMessage).toBeFalsy();
    });

    it('call to ngOnInit should set reasonMessage', () => {
        component.rejectQuestion = testData.questions.unpublished[1];
        component.ngOnInit();
        expect(component.reasonMessage).toBe(testData.questions.unpublished[1].reason);
    });

    it('call to showQuestion should emit the reasonMessage', () => {
        component.rejectQuestion = testData.questions.published[0];
        spyOn(component.cancelStatus, 'emit');
        component.showQuestion();
        expect(component.cancelStatus.emit).toHaveBeenCalledWith(component.reasonMessage);
    });
});
