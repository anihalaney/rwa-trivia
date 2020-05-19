import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionsTableComponent } from './questions-table.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { StoreModule, MemoizedSelector, Store } from '@ngrx/store';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { coreState, CoreState, UserActions, ActionWithPayload } from 'shared-library/core/store';
import { Utils, WindowRef } from 'shared-library/core/services';
import { MatSnackBarModule, MatSelectModule, MatPaginatorModule, MatCheckboxModule, PageEvent, MatSelectChange } from '@angular/material';
import { testData } from 'test/data';
import { NO_ERRORS_SCHEMA } from '@angular/compiler/src/core';
import { CdkColumnDef, CdkRowDef, CdkHeaderRowDef } from '@angular/cdk/table';

describe('QuestionsTableComponent', () => {
  let component: QuestionsTableComponent;
  let fixture: ComponentFixture<QuestionsTableComponent>;
  let mockStore: MockStore<CoreState>;
  let spy: any;
  let mockCoreSelector: MemoizedSelector<CoreState, Partial<CoreState>>;



  beforeEach(async(() => {

    TestBed.configureTestingModule({

      imports: [ReactiveFormsModule, FormsModule, StoreModule.forRoot({}), MatSnackBarModule,
        MatSelectModule, MatPaginatorModule, MatCheckboxModule],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [provideMockStore({
        initialState: {},
        selectors: [
          {
            selector: coreState,
            value: {}
          }
        ]
      }),
        UserActions,
        Utils,
        WindowRef],
      declarations: [QuestionsTableComponent, CdkColumnDef, CdkRowDef, CdkHeaderRowDef]
    });

    fixture = TestBed.createComponent(QuestionsTableComponent);
    mockStore = TestBed.get(Store);
    component = fixture.componentInstance;
    mockCoreSelector = mockStore.overrideSelector<CoreState, Partial<CoreState>>(coreState, {});
    spy = spyOn(mockStore, 'dispatch');
    fixture.detectChanges();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('call to getDisplayStatus ', () => {
    const statusName = component.getDisplayStatus(2);
    expect(statusName).toBe('APPROVED');
  });

  it('call to displayRequestToChange  should set requestQuestionStatus set true, rejectQuestionStatus to false set requestQuestion', () => {
    const question = testData.questions.published[0];
    component.displayRequestToChange(question);
    expect(component.requestQuestionStatus).toBeTruthy();
    expect(component.rejectQuestionStatus).toBeFalsy();
    expect(component.requestQuestion).toBe(question);
  });

  it('call to displayRejectToChange  should set requestQuestionStatus set true, rejectQuestionStatus to false set requestQuestion', () => {
    const question = testData.questions.unpublished[0];
    component.displayRejectToChange(question);
    expect(component.rejectQuestionStatus).toBeTruthy();
    expect(component.requestQuestionStatus).toBeFalsy();
    expect(component.rejectQuestion).toBe(question);
  });


  it('call to editQuestions set editQuestion is_draft true', () => {
    const question = testData.questions.unpublished[0];

    component.editQuestions(question);
    expect(component.editQuestion.is_draft).toBeTruthy();

  });

  it('call to approveButtonClicked should emit question', () => {
    const question = testData.questions.unpublished[0];
    component.approveButtonClicked(question);
    spyOn(component.onApproveClicked, 'emit');
    component.approveButtonClicked(question);
    expect(component.onApproveClicked.emit).toHaveBeenCalledWith(question);
  });



  it('call to pageChanged should emit question', () => {

    spyOn(component.onPageChanged, 'emit');
    const pageEvent: PageEvent = {
      pageIndex: 1,
      previousPageIndex: 0,
      pageSize: 20,
      length: 2
    };
    component.pageChanged(pageEvent);
    expect(component.onPageChanged.emit).toHaveBeenCalledWith(pageEvent);

  });


  it('call to sortOrderChanged should emit question', () => {

    spyOn(component.onSortOrderChanged, 'emit');
    const event: MatSelectChange | any = {
      source: '',
      value: 1,
    };
    component.sortOrderChanged(event);
    expect(component.onSortOrderChanged.emit).toHaveBeenCalledWith(event.value);

  });

  it('call to nullifyQuestion with updateStatus true then it should set editQuestion to null', () => {

    component.nullifyQuestion(true);
    expect(component.editQuestion).toBe(null);

  });

  it('call to nullifyQuestion with updateStatus false then it should set editQuestion to null', () => {
    component.editQuestion = testData.questions.unpublished[0];
    component.nullifyQuestion(false);
    expect(component.editQuestion).not.toBeNull();

  });

});





