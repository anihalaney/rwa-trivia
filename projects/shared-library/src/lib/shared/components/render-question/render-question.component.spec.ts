import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RenderQuestionComponent } from './render-question.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { testData } from 'test/data';
import { Question } from 'shared-library/shared/model';
import { SafeHtmlPipe } from 'shared-library/shared/pipe';


describe('RenderQuestionComponent', () => {
    let component: RenderQuestionComponent;
    let fixture: ComponentFixture<RenderQuestionComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            schemas: [NO_ERRORS_SCHEMA],
            imports: [],
            declarations: [RenderQuestionComponent, SafeHtmlPipe]
        });

        fixture = TestBed.createComponent(RenderQuestionComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('Initial value of the question and questionIndex should be falsy', () => {
        expect(component.question).toBeFalsy()
        expect(component.questionIndex).toBeFalsy()
    });

    it('call to ngOnInit should set questionIndex appended by "." if questionIndex is exits', () => {
        component.questionIndex = 1;
        fixture.detectChanges();
        component.ngOnInit();
        expect(component.questionIndex).toEqual('1.');
    });
});
