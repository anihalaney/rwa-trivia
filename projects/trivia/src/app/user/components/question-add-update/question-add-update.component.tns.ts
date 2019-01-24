import { Component, OnDestroy, ViewChild, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl, Validators } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { RouterExtensions } from 'nativescript-angular/router';
import { Utils } from 'shared-library/core/services';
import { AppState, appState } from '../../../store';
import { QuestionActions } from 'shared-library/core/store/actions/question.actions';
import { Question, Answer } from 'shared-library/shared/model';
import { QuestionAddUpdate } from './question-add-update';
import { debounceTime, map } from 'rxjs/operators';
import { ObservableArray } from 'tns-core-modules/data/observable-array';
import { TokenModel } from 'nativescript-ui-autocomplete';
import { RadAutoCompleteTextViewComponent } from 'nativescript-ui-autocomplete/angular';
import * as Toast from 'nativescript-toast';
import { Page } from 'tns-core-modules/ui/page';

@Component({
  selector: 'app-question-add-update',
  templateUrl: './question-add-update.component.html',
  styleUrls: ['./question-add-update.component.css']
})

export class QuestionAddUpdateComponent extends QuestionAddUpdate implements OnDestroy, OnChanges {

  showSelectCategory = false;
  showSelectTag = false;
  dataItem;
  customTag: string;
  private tagItems: ObservableArray<TokenModel>;
  categoryIds: any[];
  submitBtnTxt: string;
  actionBarTxt: string;
  @Input() editQuestion: Question;
  @Output() hideQuestion = new EventEmitter<boolean>();
  @ViewChild('autocomplete') autocomplete: RadAutoCompleteTextViewComponent;

  get dataItems(): ObservableArray<TokenModel> {
    return this.tagItems;
  }


  // Constructor
  constructor(public fb: FormBuilder,
    public store: Store<AppState>,
    public utils: Utils,
    public questionAction: QuestionActions,
    private routerExtension: RouterExtensions,
    private page: Page) {

    super(fb, store, utils, questionAction);

    this.submitBtnTxt = 'SUBMIT';
    this.actionBarTxt = 'Submit Question';
    this.initDataItems();
    this.question = new Question();
    this.subs.push(this.store.select(appState.coreState).pipe(select(s => s.applicationSettings)).subscribe(appSettings => {
      if (appSettings) {
        this.applicationSettings = appSettings[0];
        this.createForm(this.question);
      }
    })
    );


    const questionControl = this.questionForm.get('questionText');

    questionControl.valueChanges.pipe(debounceTime(500)).subscribe(v => this.computeAutoTags());
    this.answers.valueChanges.pipe(debounceTime(500)).subscribe(v => this.computeAutoTags());

    this.subs.push(store.select(appState.coreState).pipe(select(s => s.questionSaveStatus)).subscribe((status) => {
      if (status === 'SUCCESS') {
        this.store.dispatch(this.questionAction.resetQuestionSuccess());
        Toast.makeText('Question saved!').show();
        this.routerExtension.navigate(['/my/questions']);
        this.actionBarTxt = 'My Question';
        setTimeout(() => {
          this.hideQuestion.emit(false);
          this.toggleLoader(false);
        }, 0);
      }
    }));

  }

  ngOnChanges() {
    if (this.editQuestion && this.applicationSettings) {
      this.createForm(this.editQuestion);
      this.categoryIds = this.editQuestion.categoryIds;
      this.categories = this.categories.map(categoryObj => {
        if (Number(categoryObj.id) === Number(this.categoryIds[0])) {
          categoryObj['isSelected'] = true;
        }
        return categoryObj;
      });
      this.enteredTags = this.editQuestion.tags;
      this.submitBtnTxt = 'RESUBMIT';
      this.actionBarTxt = 'Update Question';
    }


  }

  private initDataItems() {
    this.tagItems = new ObservableArray<TokenModel>();

    for (let i = 0; i < this.tags.length; i++) {
      this.tagItems.push(new TokenModel(this.tags[i], undefined));
    }
  }


  createForm(question: Question) {

    const answersFA: FormArray = super.createDefaultForm(question);

    this.questionForm = this.fb.group({
      questionText: [question.questionText,
      Validators.compose([Validators.required, Validators.maxLength(this.applicationSettings.question_max_length)])],
      tags: '',
      answers: answersFA,
      ordered: [question.ordered],
      explanation: [question.explanation]
    }, { validator: questionFormValidator }
    );
  }


  selectCategory(category) {
    this.categoryIds = [];
    this.categories = this.categories.map(categoryObj => {
      categoryObj.isSelected = false;
      return categoryObj;
    });
    category.isSelected = (!category.isSelected) ? true : false;
    this.categoryIds.push(category.id);
  }

  addCustomTag() {
    super.addTag(this.customTag);
    this.customTag = '';
    this.autocomplete.autoCompleteTextView.resetAutocomplete();
  }

  public onDidAutoComplete(args) {
    this.customTag = args.text;
  }

  public onTextChanged(args) {
    this.customTag = args.text;
  }

  submit() {

    const question: Question = super.onSubmit();
    (this.editQuestion) ? question.id = this.editQuestion.id : '';
    if (question && this.categoryIds.length > 0 && this.enteredTags.length > 2) {
      question.categoryIds = this.categoryIds;
      this.toggleLoader(true);
      // call saveQuestion
      this.saveQuestion(question);
    }

  }

  ngOnDestroy() {
    this.utils.unsubscribe(this.subs);
  }
}

// Custom Validators
function questionFormValidator(fg: FormGroup): { [key: string]: boolean } {
  const answers: Answer[] = fg.get('answers').value;

  if (answers.filter(answer => answer.correct).length !== 1) {
    return { 'correctAnswerCountInvalid': true };
  }


}

