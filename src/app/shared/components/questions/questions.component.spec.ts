import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { By }              from '@angular/platform-browser';
import { Component, DebugElement }    from '@angular/core';
import { SharedMaterialModule } from '../../../shared/shared-material.module';

import { TEST_DATA } from '../../../testing/test.data';
import { Question, QuestionStatus }     from '../../../model';
import { QuestionsComponent } from './questions.component';

//Isolated Test
describe('Component: QuestionsComponent', () => {

  let comp: QuestionsComponent;
  let fixture: ComponentFixture<QuestionsComponent>;
  let de: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionsComponent ], // declare the test component
      imports: [
        //Material
        SharedMaterialModule
      ],
    providers:[
        
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(QuestionsComponent);

    comp = fixture.componentInstance; // Component test instance

  }));

  //Unit Tests
  it('Question Count', () => {
    //set component input
    comp.questions = TEST_DATA.questions.published;
    comp.categoryDictionary = TEST_DATA.categoryDictionary;
    comp.showApproveButton = false;

    fixture.detectChanges();
    let qNodes = fixture.debugElement.queryAll(By.css('mat-card'));

    expect(qNodes.length).toEqual(TEST_DATA.questions.published.length);
  });

  it('Question Status & Approve Button Click', () => {
    //set component input
    let expectedQuestion: Question = TEST_DATA.questions.published[0];
    expectedQuestion.status = 0;
    comp.questions = TEST_DATA.questions.published;
    comp.categoryDictionary = TEST_DATA.categoryDictionary;
    comp.showApproveButton = true;

    fixture.detectChanges();

    let selectedQuestion: Question;
    comp.approveClicked.subscribe((question: Question) => selectedQuestion = question);

    let qNodes = fixture.debugElement.queryAll(By.css('mat-card'));
    let qApproveButtons = fixture.debugElement.queryAll(By.css('.approve-button'));
    expect(qApproveButtons.length).toEqual(1);  //only one approve button should exist

    let qStatus  = qNodes[0].query(By.css('.question-status')).nativeElement; // find staus of the 1st Q
    expect(qStatus.textContent).toContain(QuestionStatus[expectedQuestion.status]);

    let qButton  = qNodes[0].query(By.css('.approve-button')); // find approve button on the 1st Q
    qButton.triggerEventHandler('click', null);
    expect(selectedQuestion).toBe(expectedQuestion);
  });
});

//Using a test host component
describe('Component: QuestionsComponent using Test Host', () => {

  let comp: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  let de: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionsComponent, TestHostComponent ], // declare the test component
      imports: [
        //Material
        SharedMaterialModule
      ],
    providers:[
        
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);

    comp = fixture.componentInstance; // Component test instance

  }));

  //Unit Tests
  it('Question Count', () => {
    //set component input
    //comp.questions = TEST_DATA.questions.published;
    //comp.categoryDictionary = TEST_DATA.categoryDictionary;
    //comp.showApproveButton = false;

    fixture.detectChanges();
    let qNodes = fixture.debugElement.query(By.css('question-list')).queryAll(By.css('mat-card'));

    expect(qNodes.length).toEqual(TEST_DATA.questions.published.length);
  });

  it('Question Status & Approve Button Click', () => {
    //set component input
    let expectedQuestion: Question = comp.questions[0];
    expectedQuestion.status = 0;
    comp.showApproveButton = true;

    fixture.detectChanges();

    let qNodes = fixture.debugElement.query(By.css('question-list')).queryAll(By.css('mat-card'));
    let qApproveButtons = fixture.debugElement.queryAll(By.css('.approve-button'));
    expect(qApproveButtons.length).toEqual(1);  //only one approve button should exist

    let qStatus  = qNodes[0].query(By.css('.question-status')).nativeElement; // find staus of the 1st Q
    expect(qStatus.textContent).toContain(QuestionStatus[expectedQuestion.status]);

    let qButton  = qNodes[0].query(By.css('.approve-button')); // find approve button on the 1st Q
    qButton.triggerEventHandler('click', null);
    expect(comp.selectedQuestion).toBe(expectedQuestion);
  });
});

@Component({
  template: `
    <question-list [questions]="questions" 
                   [categoryDictionary]="categoryDictionary"
                   [showApproveButton]="showApproveButton"
                   (approveClicked)="approveQuestion($event)">
    </question-list>
    `
})
class TestHostComponent {
  questions:Question[] = TEST_DATA.questions.published;
  categoryDictionary = TEST_DATA.categoryDictionary;
  showApproveButton = false;

  selectedQuestion: Question;
  approveQuestion(question: Question) { this.selectedQuestion = question; }
}
