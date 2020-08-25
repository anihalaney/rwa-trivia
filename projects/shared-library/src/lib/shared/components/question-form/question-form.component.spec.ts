import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { QuestionFormComponent } from './question-form.component';
import { ReactiveFormsModule, FormsModule, FormArray, FormControl, FormBuilder } from '@angular/forms';
import { StoreModule, MemoizedSelector, Store } from '@ngrx/store';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { coreState, CoreState, categoryDictionary, QuestionActions, ActionWithPayload } from 'shared-library/core/store';
import { Utils, WindowRef, QuestionService } from 'shared-library/core/services';
import { MatSnackBarModule, MatDialogModule, MatAutocompleteModule } from '@angular/material';
import { testData } from 'test/data';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DbService } from 'shared-library/core/db-service';
import { Question } from 'shared-library/shared/model';
import { of } from 'rxjs';
import * as userActions from '../../../../../../trivia/src/app/user/store/actions';


describe('QuestionFormComponent', () => {
  let component: QuestionFormComponent;
  let fixture: ComponentFixture<QuestionFormComponent>;
  let mockStore: MockStore<CoreState>;
  let spy: any;
  let mockCoreSelector: MemoizedSelector<CoreState, Partial<CoreState>>;


  const questionObject = () => {
    let question = new Question();
    question = testData.question;
    return question;
  };


  beforeEach(async(() => {

    // create new instance of FormBuilder
    const formBuilder: FormBuilder = new FormBuilder();

    TestBed.configureTestingModule({
      declarations: [QuestionFormComponent],
      imports: [ReactiveFormsModule, FormsModule, StoreModule.forRoot({}), MatSnackBarModule, MatAutocompleteModule,
        RouterTestingModule.withRoutes([]), HttpClientModule, BrowserAnimationsModule, MatDialogModule],
      providers: [provideMockStore({
        initialState: {},
        selectors: [
          {
            selector: coreState,
            value: {}
          },
          {
            selector: categoryDictionary,
            value: {}
          }
        ],
      }),
        QuestionActions,
        DbService,
        WindowRef,
      {
        provide: Utils, useValue: {
          getQuestionUrl(imageName: string) {
            return 'https://rwa-trivia-dev-e57fc.firebaseapp.com/v1/question/getQuestionImage/1584710091867?d=1584710092439';
          },
          regExpEscape(s: string) {
            return String(s).replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, '\\$1').
              replace(/\x08/g, '\\x08');
          }
        }
      },
      {
        provide: QuestionService, useValue: {
          saveQuestionImage(image: any, fileName: string) {
            return of('file_12457850');
          }
        }
      }],

      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(QuestionFormComponent);
    mockStore = TestBed.get(Store);
    component = fixture.componentInstance;
    mockCoreSelector = mockStore.overrideSelector<CoreState, Partial<CoreState>>(coreState, {});
    spy = spyOn(mockStore, 'dispatch');

    component.categoriesObs = of(testData.categories.categories);
    component.tagsObs = of(testData.tagList);
    const question = new Question();
    const answersFA: FormArray = component.createAnswerFormArray(question);
    component.editQuestion = questionObject();
    component.questionForm = formBuilder.group({
      id: null,
      is_draft: null,
      category: null,
      questionText: null,
      tags: '',
      tagsArray: new FormArray([new FormControl('')]),
      answers: answersFA,
      ordered: null,
      explanation: null,
      isRichEditor: null,
      maxTime: null,
    });
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('on call addTag function it should insert tag in enteredTags', () => {
    component.questionForm.get('tags').setValue('angular');
    component.addTag();
    expect(component.enteredTags).toEqual(['angular']);
  });

  it('on call removeEnteredTag function it should call removeEnteredTag and setTagsArray function', () => {
    const spyOnRemoveEnteredTag = spyOn(component, 'removeEnteredTag').and.callThrough();
    const spyOnSetTagsArray = spyOn(component, 'setTagsArray').and.callThrough();

    component.removeEnteredTag('angular');

    expect(spyOnRemoveEnteredTag).toHaveBeenCalled();
    expect(spyOnSetTagsArray).toHaveBeenCalled();

  });

  it('on call computeAutoTags function it should call computeAutoTags and setTagsArray function', () => {
    const spyOnComputeAutoTags = spyOn(component, 'computeAutoTags').and.callThrough();
    const spyOnSetTagsArray = spyOn(component, 'setTagsArray').and.callThrough();

    component.computeAutoTags();
    expect(spyOnComputeAutoTags).toHaveBeenCalled();
    expect(spyOnSetTagsArray).toHaveBeenCalled();

  });

  it(`call to computeAutoTags function should get the auto tags from the question and answers, when question is not rich editor`, () => {

    component.questionForm.get('questionText').setValue('Which of the following option leads to the portability and security of Java?');

    const answers = (<FormArray>component.questionForm.get('answers'));
    answers.controls[0]['controls'].answerText.setValue('A');
    answers.controls[1]['controls'].answerText.setValue('B');
    answers.controls[2]['controls'].answerText.setValue('C');
    answers.controls[3]['controls'].answerText.setValue('D');
    component.questionForm.get('answers');

    component.tags = testData.tagList;

    component.computeAutoTags();
    expect(component.autoTags).toEqual(['Java', 'C']);
    expect(component).toBeTruthy();
  });

  it(`call to computeAutoTags function should get the auto tags from the question and answers,  when question is rich editor`, () => {

    const quillObj = {
      questionText: `<p>Which of the following option leads to the portability and security of Java?</p>`
    };
    component.questionForm.get('isRichEditor').setValue(true);
    component.quillObject = quillObj;

    const answers = (<FormArray>component.questionForm.get('answers'));
    answers.controls[0]['controls'].answerText.setValue('A');
    answers.controls[1]['controls'].answerText.setValue('B');
    answers.controls[2]['controls'].answerText.setValue('C');
    answers.controls[3]['controls'].answerText.setValue('D');
    component.questionForm.get('answers');

    component.tags = testData.tagList;
    component.computeAutoTags();
    expect(component.autoTags).toEqual(['Java', 'C']);
    expect(component).toBeTruthy();
  });


  it('on call onAnswerChanged function it should set delta to answerObject and html to answerText', () => {
    const event = {
      delta: [{ insert: 'hello' }],
      html: '<p>hello</p>',
      imageParsedName: ''
    };

    component.onAnswerChanged(event, 0);
    const answers = (<FormArray>component.questionForm.get('answers'));
    expect(answers.controls[0]['controls'].answerObject.value).toEqual(event.delta);
    expect(answers.controls[0]['controls'].answerText.value).toEqual(event.html);

  });
  it(`call to onTextChanged function should not dispatch event for delete question image if image is not exist`, () => {

    const event = {
      delta: [{ insert: 'hello' }],
      html: '<p>hello</p>',
    };

    spy.and.callFake((action: ActionWithPayload<string>) => {
      expect(action.type).toEqual(QuestionActions.DELETE_QUESTION_IMAGE);
    });

    component.onTextChanged(event);
    expect(mockStore.dispatch).not.toHaveBeenCalled();
  });


  it(`call to onTextChanged function should assign quill text to quillObject and dispatch event for delete question image`, () => {

    const event = {
      delta: [{ insert: 'hello' }],
      html: '<p>hello</p>',
      imageParsedName: 'image.png'
    };

    spy.and.callFake((action: ActionWithPayload<string>) => {
      expect(action.type).toEqual(QuestionActions.DELETE_QUESTION_IMAGE);
      expect(action.payload).toEqual(event.imageParsedName);
    });

    component.onTextChanged(event);

    expect(component.quillObject.jsonObject).toEqual(event.delta);
    expect(component.quillObject.questionText).toEqual(event.html);
    expect(mockStore.dispatch).toHaveBeenCalled();

  });


  it(`Call to getQuestionFromFormValue it should return form values from form`, () => {
    component.applicationSettings = testData.applicationSettings;
    component.createForm(questionObject());
    component.questionForm.get('isRichEditor').setValue(true);
    component.questionForm.get('maxTime').setValue(8);

    const question = component.getQuestionFromFormValue(component.questionForm.value);
    const originalQuestion = {
      isRichEditor: true,
      id: '5xLESijm648e2gsZJU8M',
      answers:
        [{
          answerText: 'A',
          correct: null,
          isRichEditor: false,
          answerObject: null
        },
        {
          answerText: 'B',
          correct: null,
          isRichEditor: false,
          answerObject: null
        },
        {
          answerText: 'C',
          correct: null,
          isRichEditor: false,
          answerObject: null
        },
        {
          answerText: 'D',
          correct: true,
          isRichEditor: false,
          answerObject: null
        }],
      ordered: false,
      tags: ['angular'],
      categories: [],
      categoryIds: [1],
      published: false,
      status: null,
      validationErrorMessages: [],
      is_draft: false,
      questionText: '',
      explanation: '',
    };

    expect(question).toEqual(originalQuestion);

  });


  it(`call to updateQuestion function it should emit updateUnpublishedQuestions and updateStatus event`, () => {

    spy = spyOn(component.updateUnpublishedQuestions, 'emit');
    spy = spyOn(component.updateStatus, 'emit');
    const question = questionObject();
    component.updateQuestion(question);
    expect(component.updateUnpublishedQuestions.emit).toHaveBeenCalledWith(question);
    expect(component.updateStatus.emit).toHaveBeenCalledWith(true);
  });


  it(`call to autoSaveQuestion function it should to dispatch event to add question add question`, () => {
    component.user = testData.userList[0];

    spy.and.callFake((action: userActions.AddQuestion) => {
      expect(action.type).toEqual(userActions.UserActionTypes.ADD_QUESTION);
    });
    component.questionForm.get('isRichEditor').setValue(true);

    component.autoSaveQuestion();
    expect(mockStore.dispatch).toHaveBeenCalled();
    expect(false).toBeFalsy();
  });


  it(`call to ngOnChanges it should create form`, () => {
    spy = spyOn(component, 'createForm');
    component.ngOnChanges();
    expect(component.createForm).toHaveBeenCalled();
  });


  it(`call to onSubmit it should return undefined if form is in valid`, () => {
    const isValidForm = component.onSubmit();
    expect(isValidForm).toBeUndefined();
  });

  it(`call to showQuestion function it should emit showQuestion event`, () => {
    spy = spyOn(component.updateStatus, 'emit');
    component.showQuestion();
    expect(component.updateStatus.emit).toHaveBeenCalledWith(true);
  });


  it(`call to onSubmit it should return undefined if form is in valid`, () => {

    component.user = testData.userList[0];
    component.questionForm.get('questionText').setValue('Which of the following option leads to the portability and security of Java?');
    const answers = (<FormArray>component.questionForm.get('answers'));
    answers.controls[0]['controls'].answerText.setValue('A');
    answers.controls[1]['controls'].answerText.setValue('B');
    answers.controls[2]['controls'].answerText.setValue('C');
    answers.controls[3]['controls'].answerText.setValue('D');

    const tagFormArray = component.questionForm.get('tagsArray') as FormArray;

    const formBuilder: FormBuilder = new FormBuilder();
    tagFormArray.push(formBuilder.control('tes'));
    tagFormArray.push(formBuilder.control('tes'));
    tagFormArray.push(formBuilder.control('tes'));

    // component.questionForm.get('answers');
    const spyOnUpdateQuestion = spyOn(component, 'updateQuestion').and.callThrough();

    const isValidForm = component.onSubmit();
    expect(spyOnUpdateQuestion).toHaveBeenCalled();
  });

  it(`call to showQuestion function it should emit showQuestion event`, () => {

    const spyOnAutoSave = spyOn(component, 'autoSave');
    component.isAutoSave = true;
    component.editQuestion.is_draft = true;
    component.ngOnInit();
    expect(spyOnAutoSave).toHaveBeenCalled();

  });

  // tslint:disable-next-line: max-line-length
  it('when is draft field is false and auto save is enabled then it should set  is draft to  true when call  auto save function to store question automatically', () => {
    mockCoreSelector.setResult({ applicationSettings: [testData.applicationSettings] });
    component.questionForm.get('is_draft').setValue(false);
    mockStore.refreshState();
    component.autoSave();
    expect(component.questionForm.get('is_draft').value).toBeTruthy();
  });

  // tslint:disable-next-line: max-line-length
  it(`When call to fileUploaded function it should open dialog to crop image and after close dialog it should upload image and
       get the image url and call function to set image in edit`, () => {
    spyOn(component.dialog, 'open').and.returnValue({ afterClosed: () => of(true) });

    const quillImageUpload = {
      file: '',
      setImage: () => { },
    };
    spyOn(quillImageUpload, 'setImage');
    component.fileUploaded(quillImageUpload);
    expect(component.dialog.open).toHaveBeenCalled();
    expect(quillImageUpload.setImage).toHaveBeenCalled();

  });

  it(`Form should have tagCountInvalid when tagsArray length is less then 3`, () => {
    component.applicationSettings = testData.applicationSettings;
    component.user = testData.userList[0];
    component.createForm(questionObject());
    expect(component.questionForm.hasError('tagCountInvalid')).toBeTruthy();
  });

  it(`Form should have correctAnswerCountInvalid error when only one answer is not selected `, () => {
    component.applicationSettings = testData.applicationSettings;
    component.user = testData.userList[0];
    component.createForm(questionObject());
    const answers = (<FormArray>component.questionForm.get('answers'));
    answers.controls[3]['controls'].correct.setValue(false);
    expect(component.questionForm.hasError('correctAnswerCountInvalid')).toBeTruthy();
  });

  it(`Form should questionText required error when email is not set`, () => {
    component.applicationSettings = testData.applicationSettings;
    component.user = testData.userList[0];
    component.createForm(questionObject());
    component.questionForm.get('questionText').setValue('');
    expect(component.questionForm.get('questionText').errors).toEqual({ 'required': true });
  });

  it(`Form should category required error when email is not set`, () => {
    component.applicationSettings = testData.applicationSettings;
    component.user = testData.userList[0];
    component.createForm(questionObject());
    component.questionForm.get('category').setValue('');
    expect(component.questionForm.get('category').errors).toEqual({ 'required': true });
  });

});
