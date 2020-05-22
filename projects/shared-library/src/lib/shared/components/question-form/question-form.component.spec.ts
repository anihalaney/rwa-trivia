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
        QuestionService,
        DbService,
        Utils,
        WindowRef],
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


  it(`call to autoSaveQuestion function  it should to dispatch event to add question add question`, () => {
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
    console.log(isValidForm);
    expect(isValidForm).toBeUndefined();
  });



});
