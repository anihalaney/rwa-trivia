import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { By }              from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DebugElement, NO_ERRORS_SCHEMA }    from '@angular/core';
import { SharedMaterialModule } from '../../../shared/shared-material.module';
import { Store } from '@ngrx/store';

import { TEST_DATA } from '../../../testing/test.data';
import { MockStore } from '../../../testing/mock-store';
import { AdminQuestionsComponent } from './admin-questions.component';
import { QuestionActions } from '../../../core/store/actions';
import { Question } from '../../../model';

describe('Component: AdminQuestionsComponent', () => {

  let comp: AdminQuestionsComponent;
  let fixture: ComponentFixture<AdminQuestionsComponent>;
  let de: DebugElement;
  let _titleEl: HTMLElement;
  let _store: any;

  //Define intial state and test state
  let _initialState = {
                        categoryDictionary: {},
                        questions: [],
                        unpublishedQuestions: [],
                        user: null
                      };
  let user = TEST_DATA.userList[0];
  let _testState = {
                    categoryDictionary: TEST_DATA.categoryDictionary,
                    questions: TEST_DATA.questions.published,
                    unpublishedQuestions: TEST_DATA.questions.unpublished,
                    user: user
                  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminQuestionsComponent ], // declare the test component
      imports: [
        NoopAnimationsModule,
        //Material
        SharedMaterialModule
      ],
    schemas:      [ NO_ERRORS_SCHEMA ],
    providers:[
        QuestionActions,
        {provide:Store, useValue: new MockStore(_initialState)}
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminQuestionsComponent);

    //get the injected instances
    _store = fixture.debugElement.injector.get(Store);
    
    comp = fixture.componentInstance; // Component test instance

    // query for the title by CSS element selector
    de = fixture.debugElement.query(By.css('mat-card-title'));
    _titleEl = de.nativeElement;

  }));

  //Unit Tests
  it('Display Title', () => {
    fixture.detectChanges();
    expect(_titleEl.textContent).toContain("Questions");
  });

  it('Approve Question', () => {
    _store.next(_testState);
    fixture.detectChanges();

    let question: Question = TEST_DATA.questions.published[0];
    spyOn(_store, 'dispatch')
          .and.callFake((action: any) => {
            expect(action.type).toEqual(QuestionActions.APPROVE_QUESTION);
            expect(action.payload).toEqual(question);
            expect(action.payload.approved_uid).toEqual(user.userId);
          });

    comp.approveQuestion(question);
    expect(_store.dispatch).toHaveBeenCalled();

  });

  //TODO: Test with questions child component

});
