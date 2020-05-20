import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionsTableComponent } from './questions-table.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { StoreModule, MemoizedSelector, Store } from '@ngrx/store';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { coreState, CoreState, UserActions } from 'shared-library/core/store';
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


  it('call to getDisplayStatus should return status in string', () => {
    const statusName = component.getDisplayStatus(2);
    expect(statusName).toBe('APPROVED');
  });

  // tslint:disable-next-line: max-line-length
  it('call to displayRequestToChange should set requestQuestionStatus set true, rejectQuestionStatus to false and set requestQuestion', () => {
    const question = testData.questions.published[0];
    component.displayRequestToChange(question);
    expect(component.requestQuestionStatus).toBeTruthy();
    expect(component.rejectQuestionStatus).toBeFalsy();
    expect(component.requestQuestion).toBe(question);
  });

  // tslint:disable-next-line: max-line-length
  it('call to displayRejectToChange should set requestQuestionStatus set false, rejectQuestionStatus to true and set rejectQuestion', () => {
    const question = testData.questions.unpublished[0];
    component.displayRejectToChange(question);
    expect(component.rejectQuestionStatus).toBeTruthy();
    expect(component.requestQuestionStatus).toBeFalsy();
    expect(component.rejectQuestion).toBe(question);
  });


  it(`call to editQuestions should set editQuestion'is_draft true`, () => {
    const question = testData.questions.unpublished[0];

    component.editQuestions(question);
    expect(component.editQuestion.is_draft).toBeTruthy();

  });

  it('call to approveButtonClicked should emit question event', () => {
    const question = testData.questions.unpublished[0];
    component.approveButtonClicked(question);
    spyOn(component.onApproveClicked, 'emit');
    component.approveButtonClicked(question);
    expect(component.onApproveClicked.emit).toHaveBeenCalledWith(question);
  });



  it('call to pageChanged should emit pageEvent event', () => {

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


  it('call to sortOrderChanged should emit value of selected field', () => {

    spyOn(component.onSortOrderChanged, 'emit');
    const event: MatSelectChange | any = {
      source: '',
      value: 'CreatedTimeDesc',
    };
    component.sortOrderChanged(event);
    expect(component.onSortOrderChanged.emit).toHaveBeenCalledWith(event.value);

  });

  it('call to nullifyQuestion with updateStatus true then it should set editQuestion to null', () => {

    component.nullifyQuestion(true);
    expect(component.editQuestion).toBe(null);

  });

  it('call to nullifyQuestion with updateStatus false then it should set editQuestion not to be null', () => {
    component.editQuestion = testData.questions.unpublished[0];
    component.nullifyQuestion(false);
    expect(component.editQuestion).not.toBeNull();
  });

  it('call to showReason function it should set question in passed index in paramter', () => {

    const index = 1;
    const row = testData.questions.unpublished[0];

    component.showReason(row, index);
    expect(component.viewReasonArray[index]).toBe(row);

  });

  it('call to updateQuestionData should emit updateUnpublishedQuestions question', () => {

    spyOn(component.updateUnpublishedQuestions, 'emit');
    const question = testData.questions.unpublished[0];
    component.updateQuestionData(question);
    expect(component.updateUnpublishedQuestions.emit).toHaveBeenCalledWith(question);

  });

  it('call to showQuestion it should set undefined whose cancel status match', () => {

    const index = 1;
    const row = testData.questions.unpublished[1];
    component.viewReasonArray[index] = row;
    component.showQuestion(row.reason);
    expect(component.viewReasonArray[index]).toBeUndefined();

  });

  it('call to approveQuestion it should emit approveUnpublishedQuestion and updateBulkUploadedApprovedQuestionStatus event', () => {

    const index = 1;
    const question = testData.questions.unpublished[1];
    const user = testData.userList[0];
    component.user = user;
    spyOn(component.approveUnpublishedQuestion, 'emit');
    spyOn(component.updateBulkUploadedApprovedQuestionStatus, 'emit');
    component.approveQuestion(question);
    expect(component.approveUnpublishedQuestion.emit).toHaveBeenCalledWith(question);
    expect(component.updateBulkUploadedApprovedQuestionStatus.emit).toHaveBeenCalledWith(question);

  });

  // tslint:disable-next-line: max-line-length
  it('call to approveQuestion it should increment approved counter by 1 and emit updateBulkUpload event if bulkUploadFileInfo exist', () => {

    const question = testData.questions.unpublished[0];
    const bulkUploadFileInfo = testData.bulkUploads[0];
    component.bulkUploadFileInfo = { ...bulkUploadFileInfo };

    const user = testData.userList[0];
    component.user = user;

    spyOn(component.updateBulkUpload, 'emit');

    component.approveQuestion(question);
    expect(component.bulkUploadFileInfo.approved).toBe((bulkUploadFileInfo.approved + 1));

    bulkUploadFileInfo.approved += 1;
    expect(component.updateBulkUpload.emit).toHaveBeenCalledWith(bulkUploadFileInfo);


  });


  // tslint:disable-next-line: max-line-length
  it('call to approveQuestion it should increment approved counter by 1 and decrement rejected by -1 and emit updateBulkUpload event if bulkUploadFileInfo exist', () => {

    const question = testData.questions.unpublished[2];
    const bulkUploadFileInfo = testData.bulkUploads[0];
    component.bulkUploadFileInfo = { ...bulkUploadFileInfo };

    const user = testData.userList[0];
    component.user = user;

    spyOn(component.updateBulkUpload, 'emit');
    component.approveQuestion(question);
    expect(component.bulkUploadFileInfo.approved).toBe((bulkUploadFileInfo.approved + 1));

    expect(component.bulkUploadFileInfo.rejected).toBe((bulkUploadFileInfo.rejected - 1));

    bulkUploadFileInfo.approved += 1;
    bulkUploadFileInfo.rejected -= 1;
    expect(component.updateBulkUpload.emit).toHaveBeenCalledWith(bulkUploadFileInfo);

  });

  // tslint:disable-next-line: max-line-length
  it('call to saveRequestToChangeQuestion it should emit updateUnpublishedQuestions event', () => {

    component.requestFormGroup.get('reason').setValue('Improved question');
    const question = testData.questions.unpublished[2];
    const user = testData.userList[0];

    component.user = user;

    component.requestQuestion = question;

    spyOn(component.updateUnpublishedQuestions, 'emit');
    component.saveRequestToChangeQuestion();
    expect(component.updateUnpublishedQuestions.emit).toHaveBeenCalledWith(question);

  });

  // tslint:disable-next-line: max-line-length
  it('call to saveRequestToChangeQuestion it should emit updateBulkUploadedRequestToChangeQuestionStatus event if status is not REJECTED', () => {

    component.requestFormGroup.get('reason').setValue('Improved question');
    const question = testData.questions.unpublished[1];
    const user = testData.userList[0];

    component.user = user;

    component.requestQuestion = question;

    spyOn(component.updateBulkUploadedRequestToChangeQuestionStatus, 'emit');
    component.saveRequestToChangeQuestion();
    expect(component.updateBulkUploadedRequestToChangeQuestionStatus.emit).toHaveBeenCalledWith(question);

  });

  // tslint:disable-next-line: max-line-length
  it('call to saveRequestToChangeQuestion it should emit updateBulkUpload event if status is not REJECTED and reason field should set blank', () => {

    component.requestFormGroup.get('reason').setValue('Improved question');
    const question = testData.questions.unpublished[0];
    const user = testData.userList[0];
    const bulkUploadFileInfo = testData.bulkUploads[0];

    component.bulkUploadFileInfo = { ...bulkUploadFileInfo };

    component.user = user;
    component.requestQuestion = question;
    spyOn(component.updateBulkUpload, 'emit');
    component.saveRequestToChangeQuestion();

    bulkUploadFileInfo.rejected -= 1;
    expect(component.updateBulkUpload.emit).toHaveBeenCalledWith(bulkUploadFileInfo);

    const reasonValue = component.requestFormGroup.get('reason').value;
    expect(reasonValue).toBe('');

  });


  it('call to saveRequestToChangeQuestion it should return undefined if requestFormGroup is invalid', () => {

    const response = component.saveRequestToChangeQuestion();

    expect(response).toBe(undefined);

  });


  it('call to saveRejectToChangeQuestion it should return undefined if rejectFormGroup is invalid', () => {

    const response = component.saveRejectToChangeQuestion();

    expect(response).toBe(undefined);

  });

  // tslint:disable-next-line: max-line-length
  it('call to saveRejectToChangeQuestion it should emit updateBulkUpload and updateUnpublishedQuestions event if status is not REJECTED and reason field should set blank', () => {

    component.rejectFormGroup.get('reason').setValue('Improved question');
    const question = testData.questions.unpublished[0];
    const user = testData.userList[0];
    const bulkUploadFileInfo = testData.bulkUploads[0];

    component.bulkUploadFileInfo = { ...bulkUploadFileInfo };

    component.user = user;
    component.rejectQuestion = question;
    spyOn(component.updateUnpublishedQuestions, 'emit');
    spyOn(component.updateBulkUpload, 'emit');
    component.saveRejectToChangeQuestion();

    bulkUploadFileInfo.rejected += 1;
    expect(component.updateUnpublishedQuestions.emit).toHaveBeenCalledWith(question);
    expect(component.updateBulkUpload.emit).toHaveBeenCalledWith(bulkUploadFileInfo);
    const reasonValue = component.rejectFormGroup.get('reason').value;
    expect(reasonValue).toBe('');

  });


  // tslint:disable-next-line: max-line-length
  it('call to saveRejectToChangeQuestion it should emit updateBulkUploadedRejectQuestionStatus event if status is not REJECTED and reason field should set blank', () => {

    component.rejectFormGroup.get('reason').setValue('Improved question');
    const question = testData.questions.unpublished[1];
    const user = testData.userList[0];

    component.user = user;
    component.rejectQuestion = question;
    spyOn(component.updateBulkUploadedRejectQuestionStatus, 'emit');

    component.saveRejectToChangeQuestion();

    expect(component.updateBulkUploadedRejectQuestionStatus.emit).toHaveBeenCalledWith(question);
    const reasonValue = component.rejectFormGroup.get('reason').value;
    expect(reasonValue).toBe('');
  });

  it('call to ngOnChanges it should call setQuestions function when clientSidePagination is false', () => {
    const questions = testData.questions.unpublished.slice(0, 1);

    spyOn(component, 'setQuestions');
    component.ngOnChanges({
      questions:
      {
        previousValue: undefined,
        currentValue: questions,
        firstChange: true,
        isFirstChange: undefined
      }
    });

    expect(component.setQuestions).toHaveBeenCalled();
  });

  it('call to ngOnChanges it should call setQuestions function when clientSidePagination is true', () => {

    const questions = testData.questions.unpublished;
    component.clientSidePagination = true;
    spyOn(component, 'setClientSidePaginationDataSource');
    component.ngOnChanges({
      questions:
      {
        previousValue: undefined,
        currentValue: questions,
        firstChange: true,
        isFirstChange: undefined
      }
    });

    expect(component).toBeTruthy();
    expect(component.setClientSidePaginationDataSource).toHaveBeenCalled();
  });


  // tslint:disable-next-line: max-line-length
  it(`call to ngOnChanges it should call setClientSidePaginationDataSource when questions are changes and question's status or is_draft changes`, () => {
    const previousQuestions = testData.questions.unpublished;

    const questionsUpdate = testData.questions.unpublished.map(question => {
      return {
        ...question,
        is_draft: !question.is_draft,
        status: 1
      };
    });

    component.isAdmin = false;
    component.isDraft = false;
    component.clientSidePagination = true;

    spyOn(component, 'setClientSidePaginationDataSource');
    component.ngOnChanges({
      questions:
      {
        previousValue: previousQuestions,
        currentValue: questionsUpdate,
        firstChange: false,
        isFirstChange: undefined
      }
    });
    expect(component.setClientSidePaginationDataSource).toHaveBeenCalled();
  });


  // tslint:disable-next-line: max-line-length
  it(`call to ngOnChanges it should call setQuestions when questions are changes and question's status or is_draft changes and clientSidePagination is false`, () => {
    const previousQuestions = testData.questions.unpublished;

    const questionsUpdate = testData.questions.unpublished.map(question => {
      return {
        ...question,
        is_draft: !question.is_draft,
        status: 1
      };
    });

    component.isAdmin = false;
    component.isDraft = false;
    component.clientSidePagination = false;

    spyOn(component, 'setQuestions');
    component.ngOnChanges({
      questions:
      {
        previousValue: previousQuestions,
        currentValue: questionsUpdate,
        firstChange: false,
        isFirstChange: undefined
      }
    });
    expect(component.setQuestions).toHaveBeenCalled();
  });

  it(`call to ngOnChanges it should set category Object`, () => {

    const categories = testData.categoryDictionary;
    component.categoryDictionary = testData.categoryDictionary;

    const categoryObject = {
      '1': 'Bit of sci-fi',
      '2': 'Programming',
      '3': 'Architecture',
      '4': 'Networking/Infrastructure',
      '5': 'Database',
      '6': 'Dev Ops',
      '7': 'UX/UI',
      '8': 'Bit of fact',
      '9': 'Hardware'
    };
    component.ngOnChanges({
      categoryDictionary:
      {
        previousValue: undefined,
        currentValue: categories,
        firstChange: true,
        isFirstChange: undefined
      }
    });
    expect(component.categoryObj).toStrictEqual(categoryObject);
  });


  it(`call to setClientSidePaginationDataSource it should set questionsDS MatTableDataSource`, () => {

    const questions = testData.questions.unpublished;
    component.setClientSidePaginationDataSource(questions);
    expect(component.questionsDS).not.toBeNull();
  });

  it(`call to setQuestions it should set value to questionsSubject `, () => {

    const questions = testData.questions.unpublished;
    component.setQuestions(questions);
    expect(component.questionsSubject.getValue()).toBe(questions);
  });

});

