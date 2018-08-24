import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { debounceTime, take } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { User, Category, Question, QuestionStatus, Answer } from '../../../../../../shared-library/src/lib/shared/model';
import { Utils } from '../../../../../../shared-library/src/lib/core/services';
import { AppState, appState } from '../../../store';
import * as userActions from '../../store/actions';

@Component({
  templateUrl: './question-add-update.component.html',
  styleUrls: ['./question-add-update.component.scss']
})
export class QuestionAddUpdateComponent implements OnInit, OnDestroy {

  tagsObs: Observable<string[]>;
  categoriesObs: Observable<Category[]>;

  subs: Subscription[] = [];

  // Properties
  categories: Category[];
  tags: string[];

  questionForm: FormGroup;
  question: Question;

  autoTags: string[] = []; // auto computed based on match within Q/A
  enteredTags: string[] = [];

  user: User;

  get answers(): FormArray {
    return this.questionForm.get('answers') as FormArray;
  }
  get tagsArray(): FormArray {
    return this.questionForm.get('tagsArray') as FormArray;
  }

  // Constructor
  constructor(private fb: FormBuilder,
    private store: Store<AppState>) {
    this.categoriesObs = store.select(appState.coreState).pipe(select(s => s.categories));
    this.tagsObs = store.select(appState.coreState).pipe(select(s => s.tags));
  }

  // Lifecycle hooks
  ngOnInit() {
    this.question = new Question();
    this.createForm(this.question);

    let questionControl = this.questionForm.get('questionText');

    questionControl.valueChanges.pipe(debounceTime(500)).subscribe(v => this.computeAutoTags());
    this.answers.valueChanges.pipe(debounceTime(500)).subscribe(v => this.computeAutoTags());

    this.subs.push(this.categoriesObs.subscribe(categories => this.categories = categories));
    this.subs.push(this.tagsObs.subscribe(tags => this.tags = tags));

  }

  ngOnDestroy() {
    Utils.unsubscribe(this.subs);
  }

  // Event Handlers
  addTag() {
    let tag = this.questionForm.get('tags').value;
    if (tag) {
      if (this.enteredTags.indexOf(tag) < 0)
        this.enteredTags.push(tag);
      this.questionForm.get('tags').setValue('');
    }
    this.setTagsArray();
  }
  removeEnteredTag(tag) {
    this.enteredTags = this.enteredTags.filter(t => t !== tag);
    this.setTagsArray();
  }
  onSubmit() {
    // validations
    this.questionForm.updateValueAndValidity();
    if (this.questionForm.invalid)
      return;

    // get question object from the forms
    let question: Question = this.getQuestionFromFormValue(this.questionForm.value);

    question.status = QuestionStatus.SUBMITTED;
    this.store.select(appState.coreState).pipe(take(1)).subscribe(s => this.user = s.user);

    question.created_uid = this.user.userId;
    // call saveQuestion
    this.saveQuestion(question);
  }

  // Helper functions
  getQuestionFromFormValue(formValue: any): Question {
    let question: Question;

    question = new Question();
    question.questionText = formValue.questionText;
    question.answers = formValue.answers;
    question.categoryIds = [formValue.category];
    question.tags = [...this.autoTags, ...this.enteredTags]
    question.ordered = formValue.ordered;
    question.explanation = formValue.explanation;

    return question;
  }

  saveQuestion(question: Question) {
    this.store.dispatch(new userActions.AddQuestion({ question: question }));
  }

  computeAutoTags() {
    let formValue = this.questionForm.value;

    let allTextValues: string[] = [formValue.questionText];
    formValue.answers.forEach(answer => allTextValues.push(answer.answerText));

    let wordString: string = allTextValues.join(" ");

    let matchingTags: string[] = [];
    this.tags.forEach(tag => {
      let patt = new RegExp('\\b(' + tag.replace("+", "\\+") + ')\\b', "ig");
      if (wordString.match(patt))
        matchingTags.push(tag);
    });
    this.autoTags = matchingTags;

    this.setTagsArray();
  }
  setTagsArray() {
    this.tagsArray.controls = [];
    [...this.autoTags, ...this.enteredTags].forEach(tag => this.tagsArray.push(new FormControl(tag)));
  }
  createForm(question: Question) {

    let fgs: FormGroup[] = question.answers.map(answer => {
      let fg = new FormGroup({
        answerText: new FormControl(answer.answerText, Validators.required),
        correct: new FormControl(answer.correct),
      });
      return fg;
    });
    let answersFA = new FormArray(fgs);

    let fcs: FormControl[] = question.tags.map(tag => {
      let fc = new FormControl(tag);
      return fc;
    });
    if (fcs.length == 0)
      fcs = [new FormControl('')];
    let tagsFA = new FormArray(fcs);

    this.questionForm = this.fb.group({
      category: [(question.categories.length > 0 ? question.categories[0] : ''), Validators.required],
      questionText: [question.questionText, Validators.required],
      tags: '',
      tagsArray: tagsFA,
      answers: answersFA,
      ordered: [question.ordered],
      explanation: [question.explanation]
    }, { validator: questionFormValidator }
    );
  }

}

// Custom Validators
function questionFormValidator(fg: FormGroup): { [key: string]: boolean } {
  let answers: Answer[] = fg.get('answers').value;
  if (answers.filter(answer => answer.correct).length !== 1) {
    return { 'correctAnswerCountInvalid': true }
  }

  let tags: string[] = fg.get('tagsArray').value;
  if (tags.length < 3)
    return { 'tagCountInvalid': true }

  return null;
}
