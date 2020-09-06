import { BulkUploadComponent } from './bulk-upload.component';
import { ComponentFixture, async, TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { AppState, appState } from '../../../store';
import { NO_ERRORS_SCHEMA } from '@angular/compiler/src/core';
import { CoreState, categoryDictionary, ActionWithPayload } from 'shared-library/core/store';
import { Store, MemoizedSelector } from '@ngrx/store';
import { testData } from 'test/data';
import { User, BulkUploadFileInfo, Question } from 'shared-library/shared/model';
import { Utils, WindowRef } from 'shared-library/core/services';
import { MatSnackBarModule, MatAutocompleteModule } from '@angular/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Papa } from 'ngx-papaparse';
import * as bulkActions from '../../../bulk/store/actions';

describe('BulkUploadComponent', () => {

  let component: BulkUploadComponent;
  let fixture: ComponentFixture<BulkUploadComponent>;
  const user: User = testData.userList[0];
  let mockStore: MockStore<AppState>;
  let mockCoreSelector: MemoizedSelector<AppState, Partial<CoreState>>;
  let mockCategorySelector: MemoizedSelector<any, {}>;
  const applicationSettings: any[] = [];
  let spy: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BulkUploadComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        provideMockStore({
          initialState: {},
          selectors: [
            {
              selector: appState.coreState,
              value: {
                user
              }
            }
          ]
        }),
        Utils,
        WindowRef,
        Papa
      ],
      imports: [MatAutocompleteModule, MatSnackBarModule, ReactiveFormsModule, FormsModule]
    });

  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkUploadComponent);
    mockStore = TestBed.get(Store);
    mockCoreSelector = mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, { user });
    mockCategorySelector = mockStore.overrideSelector(categoryDictionary, {});
    component = fixture.debugElement.componentInstance;
    spy = spyOn(mockStore, 'dispatch');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('Verify that categories after store emit by store', () => {
    const categories = testData.categories.categories;
    mockCoreSelector.setResult({ categories: categories });
    mockStore.refreshState();
    fixture.detectChanges();
    component.ngOnInit();
    expect(component.categories).toBe(categories);
  });

  it('verify that tags after value is emit by store', () => {
    mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {
      tags: testData.tagList
    });
    mockStore.refreshState();
    fixture.detectChanges();
    expect(component.tags).toEqual(testData.tagList);
  });

  it('verify user after value is emit by store', () => {
    const resultUser = testData.userList[0];
    component.ngOnInit();
    expect(component.user).toEqual(resultUser);
  });

  it('verify that applicationSettings should set after value is emit by store', () => {
    applicationSettings.push(testData.applicationSettings);
    mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {
      applicationSettings: applicationSettings
    });
    mockStore.refreshState();
    component.ngOnInit();
    expect(component.applicationSettings).toBe(applicationSettings[0]);
  });
  // value change event not called
  it('on call addTag function it should insert tag in enteredTags', () => {
    component.ngOnInit();
    component.uploadFormGroup.get('tagControl').setValue('angraular');

  });

  it(`call to filter function it should should return the matched`, () => {
    component.tags = testData.tagList;
    const filteredTag = component.filter('Java');
    expect(filteredTag).toEqual(['Java', 'JavaScript']);
  });

  it(`onFileChange call it should set value in csvFile and should call getLoadCallback functions`, () => {
    component.ngOnInit();
    const mockFile = new File([''], 'filename', { type: 'text/csv' });
    const mockEvt = { target: { files: [mockFile] } };
    const mockFileReader = new FileReader();
    const blob = new Blob();
    mockFileReader.readAsBinaryString(blob);
    spyOn(component, 'getLoadCallback').and.returnValue(() => { });
    component.onFileChange(mockEvt);
    const csvFileValue = component.uploadFormGroup.get('csvFile').value;
    expect(csvFileValue).not.toBeNull();
    expect(component.getLoadCallback).toHaveBeenCalledWith(mockFile, mockFileReader);
  });


  it(`loadCallback function should call`, () => {
    component.ngOnInit();
    const mockFile = new File([''], 'filename', { type: 'text/csv' });
    const mockEvt = { target: { files: [mockFile] } };
    spyOn(component, 'getLoadCallback').and.returnValue(() => { });
    const fileReader = new FileReader();
    const blob = new Blob();
    fileReader.readAsBinaryString(blob);
    component.onFileChange(mockEvt);

    const loadCallback: () => void = component.getLoadCallback(mockFile, fileReader);
    // console.log('tes', loadCallback());
  });

  it(`To call generateQuestions function it should set uploaded questions and set bulkUploadFileInfo`, () => {

    const csvString = `Question,Option 1,Option 2,Option 3,Option 4,Answer Index,Tag 1,Tag 2,Tag 3,Tag 4,Tag 5,Tag 6,Tag 7,Tag 8,Tag 9
    Which one of the following is a Structural Directive?,ngClass,*ngIf,ngModel,ngStyle,2,Angular,Directive,Structural Directive,,,,,,`;

    const question: Question = new Question();
    question.isRichEditor = false;
    question.ordered = false;
    question.tags = ['Angular', 'Directive', 'Structural Directive'];
    question.categories = [];
    question.categoryIds = [];
    question.published = false;
    question.status = 4;
    question.validationErrorMessages = [];
    question.questionText = 'Which one of the following is a Structural Directive?';
    question.explanation = 'status - not approved';
    question.created_uid = '4kFa6HRvP5OhvYXsH9mEsRrXj4o2';
    question.answers = [
      { 'id': 1, 'answerText': 'ngClass', correct: false },
      { 'id': 2, 'answerText': '*ngIf', correct: true },
      { 'id': 3, 'answerText': 'ngModel', correct: false },
      { 'id': 4, 'answerText': 'ngStyle', correct: false }
    ];

    component.bulkUploadFileInfo = new BulkUploadFileInfo();
    component.applicationSettings = testData.applicationSettings;
    component.generateQuestions(csvString);

    const expectBulkUploadFileInfo = new BulkUploadFileInfo();
    expectBulkUploadFileInfo.uploaded = 1;
    expect(component.bulkUploadFileInfo).toMatchObject(expectBulkUploadFileInfo);
    expect(component.questions).toMatchObject([question]);
  });


  it(`To call generateQuestions function when valid column is not passed then it should display error`, () => {

    const csvString = `Question2,Option 1,Option 2,Option 3,Option 4,Answer Index,Tag 1,Tag 2,Tag 3,Tag 4,Tag 5,Tag 6,Tag 7,Tag 8,Tag 9
    Which one of the following is a Structural Directive?,ngClass,*ngIf,ngModel,ngStyle,2,Angular,Directive,Structural Directive,,,,,,`;

    const question: Question = new Question();
    const errorMsg = `File format is not correct, must be in CSV format, must not have missing or wrong column order.`;


    component.bulkUploadFileInfo = new BulkUploadFileInfo();
    component.applicationSettings = testData.applicationSettings;

    const response = component.generateQuestions(csvString);
    expect(component.fileParseErrorMessage).toBe(errorMsg);
    expect(component.fileParseError).toBeTruthy();
    expect(response).toBeUndefined();
  });


  it(`To call generateQuestions function it should set error message when question is empty`, () => {

    const csvString = `Question,Option 1,Option 2,Option 3,Option 4,Answer Index,Tag 1,Tag 2,Tag 3,Tag 4,Tag 5,Tag 6,Tag 7,Tag 8,Tag 9
     ,ngClass,*ngIf,ngModel,ngStyle,2,Angular,Directive,Structural Directive,,,,,,`;

    component.bulkUploadFileInfo = new BulkUploadFileInfo();
    component.applicationSettings = testData.applicationSettings;
    component.generateQuestions(csvString);

    const expectBulkUploadFileInfo = new BulkUploadFileInfo();
    expectBulkUploadFileInfo.uploaded = 1;
    expect(component.questionValidationError).toBeTruthy();
    expect(component.questions[0].validationErrorMessages).toMatchObject(['Missing Question']);
  });


  it(`To call generateQuestions function it should set error message when answer is empty`, () => {
    const csvString = `Question,Option 1,Option 2,Option 3,Option 4,Answer Index,Tag 1,Tag 2,Tag 3,Tag 4,Tag 5,Tag 6,Tag 7,Tag 8,Tag 9
    Which one of the following is a Structural Directive?,,*ngIf,ngModel,ngStyle,2,Angular,Directive,Structural Directive,,,,,,`;

    component.bulkUploadFileInfo = new BulkUploadFileInfo();
    component.applicationSettings = testData.applicationSettings;
    component.generateQuestions(csvString);

    const expectBulkUploadFileInfo = new BulkUploadFileInfo();
    expectBulkUploadFileInfo.uploaded = 1;
    expect(component.questionValidationError).toBeTruthy();
    expect(component.questions[0].validationErrorMessages).toMatchObject(['Missing Question Answer Options']);
  });

  it(`To call generateQuestions function it should set error message when answer index is wrong or not provided`, () => {

    const csvString = `Question,Option 1,Option 2,Option 3,Option 4,Answer Index,Tag 1,Tag 2,Tag 3,Tag 4,Tag 5,Tag 6,Tag 7,Tag 8,Tag 9
    Which one of the following is a Structural Directive?,ngClass,*ngIf,ngModel,ngStyle,6,Angular,Directive,Structural Directive,,,,,,`;

    component.bulkUploadFileInfo = new BulkUploadFileInfo();
    component.applicationSettings = testData.applicationSettings;
    component.generateQuestions(csvString);

    const expectBulkUploadFileInfo = new BulkUploadFileInfo();
    expectBulkUploadFileInfo.uploaded = 1;
    expect(component.questionValidationError).toBeTruthy();
    expect(component.questions[0].validationErrorMessages).toMatchObject(['Must have exactly one correct answer']);
  });


  // tslint:disable-next-line: max-line-length
  it(`To call generateQuestions function it should set error message when when question text length greater then max length then it should display error`, () => {

    const csvString = `Question,Option 1,Option 2,Option 3,Option 4,Answer Index,Tag 1,Tag 2,Tag 3,Tag 4,Tag 5,Tag 6,Tag 7,Tag 8,Tag 9
    I have encountered several "Dummy" questions in the 4th practice test that are explained as to judge difficulty. Are these to represent the 25 questions on the PMP that will not be counted? Can we expect that these types of questions will cover topics that are not included in PMBOK v5,ngClass,*ngIf,ngModel,ngStyle,1,Angular,Directive,Structural Directive,,,,,,`;


    component.bulkUploadFileInfo = new BulkUploadFileInfo();
    component.applicationSettings = testData.applicationSettings;
    component.generateQuestions(csvString);

    const expectBulkUploadFileInfo = new BulkUploadFileInfo();
    expectBulkUploadFileInfo.uploaded = 1;
    expect(component.questionValidationError).toBeTruthy();
    expect(component.questions[0].validationErrorMessages).toMatchObject(['256 characters are allowed for Question Text']);
  });

  // tslint:disable-next-line: max-line-length
  it(`To call generateQuestions function it should set error message when when answer text length is greater then max length then it should display error`, () => {

    const csvString = `Question,Option 1,Option 2,Option 3,Option 4,Answer Index,Tag 1,Tag 2,Tag 3,Tag 4,Tag 5,Tag 6,Tag 7,Tag 8,Tag 9
    Which one of the following is a Structural Directive?,Contrary to popular beliefLorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC making it over 2000 years old.,*ngIf,ngModel,ngStyle,1,Angular,Directive,Structural Directive,,,,,,`;


    component.bulkUploadFileInfo = new BulkUploadFileInfo();
    component.applicationSettings = testData.applicationSettings;
    component.generateQuestions(csvString);

    const expectBulkUploadFileInfo = new BulkUploadFileInfo();
    expectBulkUploadFileInfo.uploaded = 1;
    expect(component.questionValidationError).toBeTruthy();
    expect(component.questions[0].validationErrorMessages).toMatchObject(['128 characters are allowed for Answer Text']);
  });


  it(`To call generateQuestions function it should set display error when tag is less than 3`, () => {

    const csvString = `Question,Option 1,Option 2,Option 3,Option 4,Answer Index,Tag 1,Tag 2,Tag 3,Tag 4,Tag 5,Tag 6,Tag 7,Tag 8,Tag 9
    Which one of the following is a Structural Directive?,ngClass,*ngIf,ngModel,ngStyle,2,Angular,Directive,,,,,,,`;
    component.applicationSettings = testData.applicationSettings;
    const expectBulkUploadFileInfo = new BulkUploadFileInfo();
    component.bulkUploadFileInfo = new BulkUploadFileInfo();
    expectBulkUploadFileInfo.uploaded = 1;
    component.generateQuestions(csvString);

    expect(component.questionValidationError).toBeTruthy();
    expect(component.questions[0].validationErrorMessages).toMatchObject(['Atleast 3 tags required']);
  });

  it(`Verify when call isTagExist function it should return index of tag if exist in list`, () => {

    const csvString = `Question,Option 1,Option 2,Option 3,Option 4,Answer Index,Tag 1,Tag 2,Tag 3,Tag 4,Tag 5,Tag 6,Tag 7,Tag 8,Tag 9
    Which one of the following is a Structural Directive?,ngClass,*ngIf,ngModel,ngStyle,2,Angular,Directive,Java Script,,,,,,`;
    component.applicationSettings = testData.applicationSettings;
    const expectBulkUploadFileInfo = new BulkUploadFileInfo();
    component.bulkUploadFileInfo = new BulkUploadFileInfo();
    expectBulkUploadFileInfo.uploaded = 1;
    component.generateQuestions(csvString);

    const indexOfTag = component.isTagExist('Angular', component.questions[0]);
    expect(indexOfTag).toBe(0);
  });

  it(`Verify when call isTagExist function it should return -1 of tag if not exist in list`, () => {

    const csvString = `Question,Option 1,Option 2,Option 3,Option 4,Answer Index,Tag 1,Tag 2,Tag 3,Tag 4,Tag 5,Tag 6,Tag 7,Tag 8,Tag 9
    Which one of the following is a Structural Directive?,ngClass,*ngIf,ngModel,ngStyle,2,Angular,Directive,Java Script,,,,,,`;
    component.applicationSettings = testData.applicationSettings;
    const expectBulkUploadFileInfo = new BulkUploadFileInfo();
    component.bulkUploadFileInfo = new BulkUploadFileInfo();
    expectBulkUploadFileInfo.uploaded = 1;
    component.generateQuestions(csvString);

    const indexOfTag = component.isTagExist('angular5', component.questions[0]);
    expect(indexOfTag).toBe(-1);
  });


  it(`To call onReviewSubmit function it should dispatch add bulk question action`, () => {
    component.bulkUploadFileInfo = new BulkUploadFileInfo();
    spy.and.callFake((action: ActionWithPayload<any>) => {
      expect(action.type).toEqual(bulkActions.BulkActionTypes.ADD_BULK_QUESTIONS);
    });
    component.onReviewSubmit();
    expect(mockStore.dispatch).toHaveBeenCalled();
  });

  it(`To call showUploadSteps function it should set showInstructions false if its true`, () => {
    component.showUploadSteps();
    console.log(component.showInstructions);
    expect(component.showInstructions).toBeFalsy();
  });

  it(`To call showUploadSteps function it should set showInstructions true if its false`, () => {
    component.showInstructions = false;
    component.showUploadSteps();
    console.log(component.showInstructions);
    expect(component.showInstructions).toBeTruthy();
  });


  it(`Verify when call onUploadSubmit it should set fileParseError and show error message`, () => {
    component.bulkUploadFileInfo = undefined;
    component.ngOnInit();
    component.onUploadSubmit();
    expect(component.fileParseError).toBeTruthy();
    expect(component.fileParseErrorMessage).toBe('Please upload .CSV file');
  });

  it(`Verify when call onUploadSubmit it should set fileParseError create parsedQuestions list`, () => {


    const csvString = `Question,Option 1,Option 2,Option 3,Option 4,Answer Index,Tag 1,Tag 2,Tag 3,Tag 4,Tag 5,Tag 6,Tag 7,Tag 8,Tag 9
    Which one of the following is a Structural Directive?,ngClass,*ngIf,ngModel,ngStyle,2,Angular,Directive,Structural Directive,,,,,,`;

    const question: Question = new Question();
    question.isRichEditor = false;
    question.ordered = false;
    question.tags = ['angular', 'Directive', 'Structural Directive'];
    question.categories = [];
    question.categoryIds = [1];
    question.published = false;
    question.status = 4;
    question.validationErrorMessages = [];
    question.questionText = 'Which one of the following is a Structural Directive?';
    question.explanation = 'status - not approved';
    question.created_uid = '4kFa6HRvP5OhvYXsH9mEsRrXj4o2';
    question.answers = [
      { 'id': 1, 'answerText': 'ngClass', correct: false },
      { 'id': 2, 'answerText': '*ngIf', correct: true },
      { 'id': 3, 'answerText': 'ngModel', correct: false },
      { 'id': 4, 'answerText': 'ngStyle', correct: false }
    ];

    component.bulkUploadFileInfo = new BulkUploadFileInfo();
    component.applicationSettings = testData.applicationSettings;


    const mockFile = new File([''], 'filename', { type: 'text/csv' });
    component.generateQuestions(csvString);
    component.bulkUploadFileInfo = new BulkUploadFileInfo();
    component.ngOnInit();
    component.uploadFormGroup.get('tagControl').setValue('angular');
    component.uploadFormGroup.get('category').setValue(1);
    component.uploadFormGroup.get('csvFile').setValue(mockFile);

    component.onUploadSubmit();

    // console.log('parsed question>>>', component.parsedQuestions);

    expect(component.parsedQuestions).toMatchObject([question]);
    expect(component.bulkUploadFileInfo.categoryId).toBe(1);
    expect(component.bulkUploadFileInfo.primaryTag).toBe('angular');
    expect(component.bulkUploadFileInfo.created_uid).toBe(user.userId);

  });




  it(`Verify when call onUploadSubmit it should set fileParseError and get tags from question`, () => {


    const csvString = `Question,Option 1,Option 2,Option 3,Option 4,Answer Index,Tag 1,Tag 2,Tag 3,Tag 4,Tag 5,Tag 6,Tag 7,Tag 8,Tag 9
    Which one of the following is a Structural Directive?,ngClass,*ngIf,ngModel,ngStyle,2,Angular,Directive,Structural Directive,,,,,,`;

    const question: Question = new Question();
    question.isRichEditor = false;
    question.ordered = false;
    question.tags = ['Angular', 'Directive', 'Structural Directive'];
    question.categories = [];
    question.categoryIds = [1];
    question.published = false;
    question.status = 4;
    question.validationErrorMessages = [];
    question.questionText = 'Which one of the following is a Structural Directive?';
    question.explanation = 'status - not approved';
    question.created_uid = '4kFa6HRvP5OhvYXsH9mEsRrXj4o2';
    question.answers = [
      { 'id': 1, 'answerText': 'ngClass', correct: false },
      { 'id': 2, 'answerText': '*ngIf', correct: true },
      { 'id': 3, 'answerText': 'ngModel', correct: false },
      { 'id': 4, 'answerText': 'ngStyle', correct: false }
    ];

    component.bulkUploadFileInfo = new BulkUploadFileInfo();
    component.applicationSettings = testData.applicationSettings;


    const mockFile = new File([''], 'filename', { type: 'text/csv' });
    component.generateQuestions(csvString);
    component.bulkUploadFileInfo = new BulkUploadFileInfo();
    component.ngOnInit();
    component.uploadFormGroup.get('tagControl').setValue('');
    component.uploadFormGroup.get('category').setValue(1);
    component.uploadFormGroup.get('csvFile').setValue(mockFile);

    component.onUploadSubmit();

    // console.log('parsed question>>>', component.parsedQuestions);

    expect(component.parsedQuestions).toMatchObject([question]);
    expect(component.bulkUploadFileInfo.categoryId).toBe(1);
    // expect(component.bulkUploadFileInfo.primaryTag).toBe('angular');
    expect(component.bulkUploadFileInfo.created_uid).toBe(user.userId);

  });




});
