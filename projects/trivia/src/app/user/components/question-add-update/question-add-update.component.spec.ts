import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { QuestionAddUpdateComponent } from './question-add-update.component';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormControl, FormArray } from '@angular/forms';
import { StoreModule, MemoizedSelector, Store } from '@ngrx/store';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { CoreState, ActionWithPayload, categoryDictionary } from 'shared-library/core/store';
import { Utils, WindowRef } from 'shared-library/core/services';
import { MatSnackBarModule } from '@angular/material';
import { AppState, appState } from '../../../../../../trivia/src/app/store';
import { testData } from 'test/data';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { RouterTestingModule } from '@angular/router/testing';
import { QuestionActions } from 'shared-library/core/store/actions/question.actions';
import { QuestionService } from 'shared-library/core/services';
import { HttpClientModule } from '@angular/common/http';
import { DbService } from 'shared-library/core/db-service';
import { MatDialogModule } from '@angular/material';
import { Router } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Question, QuestionStatus } from 'shared-library/shared/model';
import * as userActions from '../../store/actions';
import { of } from 'rxjs';

describe('QuestionAddUpdateComponent', () => {
  let component: QuestionAddUpdateComponent;
  let fixture: ComponentFixture<QuestionAddUpdateComponent>;
  let mockStore: MockStore<AppState>;
  let spy: any;
  let mockCoreSelector: MemoizedSelector<CoreState, Partial<CoreState>>;
  let router: Router;

  const questionObject = () => {
    let question = new Question();
    question = testData.question;
    return question;
  };

  const quillObject = () => {
    return {
      jsonObject: [{ insert: 'hello' }],
      questionText: '<p>hello</p>',
    };
  };

  beforeEach(async(() => {

    // create new instance of FormBuilder
    const formBuilder: FormBuilder = new FormBuilder();

    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [QuestionAddUpdateComponent],
      imports: [ReactiveFormsModule, FormsModule, StoreModule.forRoot({}), MatSnackBarModule, MatAutocompleteModule,
        RouterTestingModule.withRoutes([]), HttpClientModule, BrowserAnimationsModule, MatDialogModule],
      providers: [provideMockStore({
        initialState: {},
        selectors: [
          {
            selector: appState.coreState,
            value: {}
          },
          {
            selector: categoryDictionary,
            value: {}
          }
        ],
      },
      ),
        QuestionActions,
        QuestionService,
        DbService,
        Utils,
        WindowRef,
      { provide: FormBuilder, useValue: formBuilder },
      ],
    });

    fixture = TestBed.createComponent(QuestionAddUpdateComponent);
    mockStore = TestBed.get(Store);
    component = fixture.componentInstance;
    mockCoreSelector = mockStore.overrideSelector<CoreState, Partial<CoreState>>(appState.coreState, {});
    spy = spyOn(mockStore, 'dispatch');
    router = TestBed.get(Router);

    const question = new Question();
    const answersFA: FormArray = component.createDefaultForm(question);
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

  it('on load component should set applicationSettings', () => {
    mockCoreSelector.setResult({ applicationSettings: [testData.applicationSettings] });
    mockStore.refreshState();
    expect(component.applicationSettings).toEqual(testData.applicationSettings);
  });

  it('Reset action should dispatch when store emit questionSaveStatus', () => {
    mockCoreSelector.setResult({ questionSaveStatus: 'SUCCESS' });
    const navigateSpy = spyOn(router, 'navigate');
    spy.and.callFake((action: ActionWithPayload<null>) => {
      expect(action.type).toEqual(QuestionActions.RESET_QUESTION_SUCCESS);
    });

    mockStore.refreshState();
    expect(mockStore.dispatch).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith(['/user/my/questions']);
  });

  it('on call setTagsArray function it should add all entered tags and auto tags into tagsArray', () => {
    component.enteredTags = ['c', 'c++', 'java'];
    component.autoTags = ['angular'];
    component.setTagsArray();
    expect(component.tagsArray.length).toBe(4);
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


  it('on call switchQuestionQuillObject function should set questionText to questionText and jsonObject to questionObject', () => {
    spy = spyOn(component, 'onSubmit').and.returnValue(questionObject());
    const quillObj = quillObject();
    component.quillObject = quillObj;
    component.switchQuestionQuillObject();

    expect(component.question.questionText).toEqual(quillObj.questionText);
    expect(component.question.questionObject).toEqual(quillObj.jsonObject);
    expect(component).toBeTruthy();

  });


  it('on submit function saveQuestion function should call and assign quill object to question object', () => {
    spy = spyOn(component, 'onSubmit').and.returnValue(questionObject());
    const spySaveQuestion = spyOn(component, 'saveQuestion');

    const quillObj = quillObject();
    component.quillObject = quillObj;
    component.submit();

    component.questionForm.get('tags').setValue('tag');
    expect(spySaveQuestion).toHaveBeenCalled();

  });

// tslint:disable-next-line:max-line-length
  it(`Categories should be set when store emit Categories and set place holder 'Select Preferred Category' to last index and set selectedQuestionCategoryIndex to categories's index`, () => {

    const categories = testData.categories.categories;
    mockCoreSelector.setResult({ categories: categories });
    mockStore.refreshState();
    expect(component.categories).toEqual(categories);
    expect(component.questionCategories[categories.length]).toBe('Select Preferred Category');
    expect(component.selectedQuestionCategoryIndex).toBe(categories.length);
  });

  it(`Question id should set when store emit questionDraftSaveStatus`, () => {
    const questionDraftSaveStatus = 'cqmHbJr7u2WU7qGEoqftdNc2WZK2';
    mockCoreSelector.setResult({ questionDraftSaveStatus });
    mockStore.refreshState();
    expect(component.questionForm.get('id').value).toBe(questionDraftSaveStatus);
  });

  it(`call to onTextChanged function should assign  quill text to quillObject and dispatch event for delete question image`, () => {

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


  it(`Call to removeEnteredTag function it should delete from enteredTags which is passed in parameters`, () => {
    component.enteredTags = ['Java', 'C', 'PHP'];
    component.removeEnteredTag('Java');
    expect(component.enteredTags).toEqual(['C', 'PHP']);
  });


  it(`call to filter function it should should return the matched`, () => {
    component.tags = testData.tagList;
    const filteredTag = component.filter('Java');
    expect(filteredTag).toEqual(['Java', 'JavaScript']);
  });


  it(`call to saveQuestion function it should dispatch add question action`, () => {

    spy.and.callFake((action: userActions.AddQuestion) => {
      expect(action.type).toEqual(userActions.UserActionTypes.ADD_QUESTION);
    });
    const question = questionObject();
    component.saveQuestion(question);
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
      id: '',
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
      tags: [],
      categories: [],
      categoryIds: [''],
      published: false,
      status: 0,
      validationErrorMessages: [],
      is_draft: false,
      questionText: '',
      explanation: '',
      createdOn: new Date(),
      maxTime: 8,
      questionObject: ''
    };

    expect(question).toEqual(originalQuestion);

  });

  it(`call to toggleLoader function it should set value to loaderBusy which is passed in paramter`, () => {
    component.toggleLoader(true);
    expect(component.loaderBusy).toBeTruthy();
  });


  it(`call to onSubmit function with skip paramter true, it should return question's object `, () => {

    component.applicationSettings = testData.applicationSettings;
    component.user = testData.userList[0];
    component.createForm(questionObject());
    component.questionForm.get('isRichEditor').setValue(true);
    component.questionForm.get('maxTime').setValue(8);

    const question = component.onSubmit(true);
    const questionFromFormValue = {
      isRichEditor: true,
      id: '',
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
      tags: [],
      categories: [],
      categoryIds: [''],
      published: false,
      status: 4,
      validationErrorMessages: [],
      is_draft: false,
      questionText: '',
      explanation: '',
      createdOn: new Date(),
      maxTime: 8,
      questionObject: '',
      created_uid: '4kFa6HRvP5OhvYXsH9mEsRrXj4o2'
    };

    expect(question).toEqual(questionFromFormValue);
  });

  it(`call to onSubmit function with skip paramter false, it should validate and return false if form is invalid`, () => {

    component.applicationSettings = testData.applicationSettings;
    component.user = testData.userList[0];
    component.createForm(questionObject());
    component.questionForm.get('isRichEditor').setValue(true);
    component.questionForm.get('maxTime').setValue(8);

    const question = component.onSubmit(false);
    expect(question).toBeFalsy();

  });

  it(`Form should have questionText required error when questionText is not set`, () => {
    component.applicationSettings = testData.applicationSettings;
    component.user = testData.userList[0];
    component.createForm(questionObject());
    expect(component.questionForm.get('questionText').errors).toEqual({ 'required': true });
  });

  it(`Form should have category required error when category is not set`, () => {
    component.applicationSettings = testData.applicationSettings;
    component.user = testData.userList[0];
    component.createForm(questionObject());
    expect(component.questionForm.get('category').errors).toEqual({ 'required': true });
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

  it(`call to setValidators function with isRichEditor is true, it should set validator for maxTime and questionText field`, () => {
    component.applicationSettings = testData.applicationSettings;
    const question = questionObject();
    question.tags = ['C', 'Java'];
    component.createForm(question);
    component.setValidators(true);
    expect(component.questionForm.get('maxTime').errors).toEqual({ 'required': true });
    expect(component.questionForm.get('questionText').errors).toEqual({ 'required': true });
  });

  it(`call to setValidators function with isRichEditor is false, it should set validator for maxTime and questionText field`, () => {
    component.applicationSettings = testData.applicationSettings;
    const question = questionObject();
    question.tags = ['C', 'Java'];
    component.createForm(question);
    component.setValidators(false);
    expect(component.questionForm.get('maxTime').errors).toBeNull();
    expect(component.questionForm.get('questionText').errors).toEqual({ 'required': true });
  });


  it(`on call setValidators function with isRichEditor is false, is should set validator for question_max_length error`, () => {
    component.applicationSettings = testData.applicationSettings;
    // tslint:disable-next-line:max-line-length
    const questionText = 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum';
    const question = questionObject();

    component.createForm(question);
    component.questionForm.get('questionText').setValue(questionText);
    component.setValidators(false);

    expect(component.questionForm.get('maxTime').errors).toBeNull();
    expect(component.questionForm.get('questionText').errors).toEqual({
      'maxlength': {
        'actualLength': 572,
        'requiredLength': 256,
      }
    });
  });



  it(`call to autoSaveQuestion function  it should to dispatch event to add question add question`, () => {
    component.user = testData.userList[0];
    component.isMobile = false;
    spy.and.callFake((action: userActions.AddQuestion) => {
      expect(action.type).toEqual(userActions.UserActionTypes.ADD_QUESTION);
    });
    component.questionForm.get('isRichEditor').setValue(true);
    component.autoSaveQuestion();
    expect(mockStore.dispatch).toHaveBeenCalled();
    expect(false).toBeFalsy();
  });

  it(`call to autoSaveQuestion function it should not dispatch add question when question is already saved `, () => {
    component.user = testData.userList[0];
    component.isMobile = false;
    component.isSaved = true;
    component.question = questionObject();
    component.question.status = QuestionStatus.PENDING;
    spy.and.callFake((action: userActions.AddQuestion) => {
      expect(action.type).toEqual(userActions.UserActionTypes.ADD_QUESTION);
    });
    component.questionForm.get('isRichEditor').setValue(true);
    component.autoSaveQuestion();
    expect(mockStore.dispatch).not.toHaveBeenCalled();
  });


  it(`call preview function it should call dialog open function`, () => {
    spyOn(component.dialog, 'open').and.returnValue({ afterClosed: () => of(true) });
    const quillObj = quillObject();
    component.quillObject = quillObj;
    component.preview();
    expect(component.dialog.open).toHaveBeenCalled();
  });

});
