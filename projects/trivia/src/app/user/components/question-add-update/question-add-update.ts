import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { Observable, of, Subject, merge } from 'rxjs';
import { debounceTime, take, map, switchMap, multicast, skip, filter } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { User, Category, Question, QuestionStatus, Answer, ApplicationSettings } from 'shared-library/shared/model';
import { Utils } from 'shared-library/core/services';
import { AppState, appState } from '../../../store';
import * as userActions from '../../store/actions';
import { QuestionActions } from 'shared-library/core/store/actions/question.actions';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { OnDestroy } from '@angular/core';
import { isEmpty } from 'lodash';

@AutoUnsubscribe({ arrayName: 'subscriptions' })
export class QuestionAddUpdate implements OnDestroy {


  tagsObs: Observable<string[]>;
  categoriesObs: Observable<Category[]>;
  isMobile = false;

  // Properties
  categories: Category[];
  questionCategories: Array<string> = [];
  tags: string[] = [];

  questionForm: FormGroup;
  question: Question;
  quillObject: any = {};

  autoTags: string[] = []; // auto computed based on match within Q/A
  enteredTags: string[] = [];
  filteredTags$: Observable<string[]>;
  loaderBusy = false;
  user: User;
  applicationSettings: ApplicationSettings;
  selectedQuestionCategoryIndex = 0;
  subscriptions = [];
  isSaved = false;
  get answers(): FormArray {
    return this.questionForm.get('answers') as FormArray;
  }

  // Constructor
  constructor(public fb: FormBuilder,
    public store: Store<AppState>,
    public utils: Utils,
    public questionAction: QuestionActions) {


    this.categoriesObs = store.select(appState.coreState).pipe(select(s => s.categories));
    this.tagsObs = store.select(appState.coreState).pipe(select(s => s.tags));

    this.subscriptions.push(this.store.select(appState.coreState).pipe(take(1)).subscribe(s => this.user = s.user));
    this.subscriptions.push(this.categoriesObs.subscribe(categories => {
      this.categories = categories;
      this.questionCategories = this.categories.map(category => category.categoryName);
      this.questionCategories.push('Select Preferred Category');
      this.selectedQuestionCategoryIndex = this.questionCategories.length - 1;
    }
    ));
    this.subscriptions.push(this.tagsObs.subscribe(tags => this.tags = tags));

    this.subscriptions.push(this.store.select(appState.coreState).pipe(select(s => s.questionDraftSaveStatus)).subscribe(status => {
      if (status && status !== 'UPDATED') {
        this.questionForm.patchValue({ id: status });
      }
    }));
  }

  saveDraft() {
    this.subscriptions.push(this.store.select(appState.coreState).pipe(
      select(s => s.applicationSettings),
      filter(applicationSettings => { return !isEmpty(applicationSettings); }),
      switchMap(appSettings => {
        if (!isEmpty(appSettings)) {
          if (appSettings[0]['auto_save']['is_enabled']) {
            if (!this.questionForm.controls.is_draft.value) {
              this.questionForm.patchValue({ is_draft: true });
            }
            return merge(
              this.questionForm.valueChanges.pipe(take(1)),
              this.questionForm.valueChanges.pipe(debounceTime(appSettings[0]['auto_save']['time'])));
          } else {
            return of();
          }
        }
      })).subscribe(data => {
        if (data) {
          const question = this.getQuestionFromFormValue(this.questionForm.value);
          if (this.question.status) {
              question.status = this.question.status;
          }
          if (!question.status) {
            question.status = QuestionStatus.PENDING;
          }

          if (question.isRichEditor && !this.isMobile ) {
            question.questionText = this.quillObject.questionText ? this.quillObject.questionText : '';
            question.questionObject = this.quillObject.jsonObject ? this.quillObject.jsonObject : {};
          }
          question.created_uid = this.user.userId;
          if (!this.isSaved) {
            this.store.dispatch(new userActions.AddQuestion({ question: question }));
          }
        }
      }));

  }


  // Text change in quill editor
  onTextChanged(text) {
    this.quillObject.jsonObject = text.delta;
    this.quillObject.questionText = text.html;
    if(text.imageParsedName){
      this.store.dispatch(this.questionAction.deleteQuestionImage(text.imageParsedName));
    }
  }

  createDefaultForm(question: Question, isRichEditor = false): FormArray {
    const fgs: FormGroup[] = question.answers.map(answer => {
      const fg = new FormGroup({
        answerText: new FormControl(answer.answerText ? answer.answerText : '',
          Validators.compose([Validators.required])),
        correct: new FormControl(answer.correct),
        isRichEditor: new FormControl(answer.isRichEditor),
        answerObject: new FormControl(answer.answerObject),
      });
      return fg;
    });
    const answersFA = new FormArray(fgs);
    return answersFA;
  }

  addTag(tag: string) {
    if (this.enteredTags.indexOf(tag) < 0) {
      this.enteredTags.push(tag);
       this.questionForm.patchValue({tags: [] });
    }
  }

  removeEnteredTag(tag) {
    this.enteredTags = this.enteredTags.filter(t => t !== tag);
    this.questionForm.patchValue({tags: [] });
  }


  computeAutoTags() {
    const formValue = this.questionForm.value;

    const allTextValues: string[] = [formValue.questionText];
    formValue.answers.forEach(answer => allTextValues.push(answer.answerText));

    const wordString: string = allTextValues.join(" ");

    const matchingTags: string[] = [];
    this.tags.forEach(tag => {
      const patt = new RegExp('\\b(' + tag.replace("+", "\\+") + ')\\b', "ig");
      if (wordString.match(patt)) {
        if (this.enteredTags.indexOf(tag) === -1 ) {
          matchingTags.push(tag);
        }
      }
    });
    this.autoTags = matchingTags;
    this.questionForm.patchValue({tags: [] });
  }


  // Helper functions
  getQuestionFromFormValue(formValue: any): Question {
    let question: Question;
    question = new Question();
    question.id = formValue.id;
    question.is_draft = formValue.is_draft;
    question.questionText = formValue.questionText;
    question.answers = formValue.answers;
    question.categoryIds = (formValue.category >= 0 ) ? [formValue.category] : [];
    question.tags = [...this.autoTags, ...this.enteredTags];
    question.ordered = formValue.ordered;
    question.explanation = formValue.explanation;
    question.createdOn = new Date();
    question.isRichEditor = formValue.isRichEditor;
    question.maxTime = formValue.maxTime;
    question.questionObject = (formValue.questionObject) ? formValue.questionObject : '';
    return question;
  }

  toggleLoader(flag: boolean) {
    this.loaderBusy = flag;
  }

  onSubmit(skipValidation = false): Question {
    // validations
    this.questionForm.updateValueAndValidity();
    if (this.questionForm.invalid && !skipValidation) {
      return;
    }

    // get question object from the forms
    const question: Question = this.getQuestionFromFormValue(this.questionForm.value);

    question.status = QuestionStatus.PENDING;

    question.created_uid = this.user.userId;
    question.is_draft = false;
    return question;
  }


  filter(val: string): string[] {
    return this.tags.filter(option => new RegExp(this.utils.regExpEscape(`${val}`), 'gi').test(option));
  }

  saveQuestion(question: Question) {
    this.store.dispatch(new userActions.AddQuestion({ question: question }));
  }

  ngOnDestroy(): void {

  }

}


