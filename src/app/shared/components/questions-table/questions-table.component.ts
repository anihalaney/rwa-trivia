import { Component, Input, Output, OnInit, OnChanges, OnDestroy, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { DataSource } from '@angular/cdk/table';
import { PageEvent, MatSelectChange } from '@angular/material';
import { Store } from '@ngrx/store';
import { Utils } from '../../../core/services';
import { AppStore } from '../../../core/store/app-store';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';

import { Question, QuestionStatus, Category, User, Answer, BulkUploadFileInfo } from '../../../model';
import { QuestionActions, BulkUploadActions } from '../../../core/store/actions';

@Component({
  selector: 'question-table',
  templateUrl: './questions-table.component.html',
  styleUrls: ['./questions-table.component.scss']
})
export class QuestionsTableComponent implements OnInit, OnDestroy, OnChanges {

  @Input() showSort: boolean;
  @Input() showPaginator: boolean;
  @Input() questions: Question[];
  @Input() totalCount: number;
  @Input() categoryDictionary: { [key: number]: Category };
  @Input() bulkUploadFileInfo: BulkUploadFileInfo;
  @Input() showApproveButton: boolean;
  @Input() showButtons: boolean;
  @Output() onApproveClicked = new EventEmitter<Question>();
  @Output() onPageChanged = new EventEmitter<PageEvent>();
  @Output() onSortOrderChanged = new EventEmitter<string>();

  requestFormGroup: FormGroup;
  rejectFormGroup: FormGroup;

  sortOrder: string;
  questionsSubject: BehaviorSubject<Question[]>;
  questionsDS: QuestionsDataSource;

  requestQuestionStatus = false;
  rejectQuestionStatus = false;
  editQuestionStatus = false;

  reason: String = '';

  requestQuestion: Question;
  rejectQuestion: Question;
  editQuestion: Question;

  // for edit
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

  constructor(private store: Store<AppStore>,
    private questionActions: QuestionActions,
    private bulkUploadActions: BulkUploadActions,
    private fb: FormBuilder) {
    this.questionsSubject = new BehaviorSubject<Question[]>([]);
    this.questionsDS = new QuestionsDataSource(this.questionsSubject);
    this.sortOrder = 'Category';

    this.categoriesObs = this.store.select(s => s.categories);
    this.tagsObs = this.store.select(s => s.tags);
    this.question = new Question();
  }

  ngOnInit() {

    this.store.take(1).subscribe(s => this.user = s.user);

    this.requestFormGroup = this.fb.group({
      reason: ['', Validators.required]
    });
    this.rejectFormGroup = this.fb.group({
      reason: ['', Validators.required]
    });

    this.questionForm = this.fb.group({
      category: [(this.question.categories.length > 0 ? this.question.categories[0] : ''), Validators.required]
    });

    this.createForm(this.question);

    const questionControl = this.questionForm.get('questionText');

    questionControl.valueChanges.debounceTime(500).subscribe(v => this.computeAutoTags());
    this.answers.valueChanges.debounceTime(500).subscribe(v => this.computeAutoTags());

    this.subs.push(this.categoriesObs.subscribe(categories => this.categories = categories));
    this.subs.push(this.tagsObs.subscribe(tags => this.tags = tags));
  }

  ngOnChanges() {
    this.questionsSubject.next(this.questions);
  }

  getDisplayStatus(status: number): string {
    return QuestionStatus[status];
  }

  // approveQuestions
  approveQuestion(question: Question) {
    question.approved_uid = this.user.userId;
    this.store.dispatch(this.questionActions.approveQuestion(question));
    if (this.bulkUploadFileInfo) {
      if (question.status === QuestionStatus.REJECTED) {
        this.bulkUploadFileInfo.rejected = this.bulkUploadFileInfo.rejected - 1;
      }
      this.bulkUploadFileInfo.approved = this.bulkUploadFileInfo.approved + 1;
      this.store.dispatch(this.bulkUploadActions.updateBulkUpload(this.bulkUploadFileInfo));
    }
  }

  displayRequestToChange(question: Question) {
    this.requestQuestionStatus = true;
    this.rejectQuestionStatus = false;
    this.requestQuestion = question;
  }

  displayRejectToChange(question: Question) {
    this.rejectQuestionStatus = true;
    this.requestQuestionStatus = false;
    this.rejectQuestion = question;
  }

  saveRequestToChangeQuestion() {
    if (!this.requestFormGroup.valid) {
      return;
    }

    if (this.bulkUploadFileInfo && this.requestQuestion.status === QuestionStatus.REJECTED) {
      this.bulkUploadFileInfo.rejected = this.bulkUploadFileInfo.rejected - 1;
      this.store.dispatch(this.bulkUploadActions.updateBulkUpload(this.bulkUploadFileInfo));
    }

    this.requestQuestion.status = QuestionStatus.REQUEST_TO_CHANGE;
    this.requestQuestion.reason = this.requestFormGroup.get('reason').value;
    this.requestQuestionStatus = false;
    this.requestQuestion.approved_uid = this.user.userId;
    this.store.dispatch(this.questionActions.updateQuestion(this.requestQuestion));
    this.requestFormGroup.get('reason').setValue('');
  }

  saveRejectToChangeQuestion() {
    if (!this.rejectFormGroup.valid) {
      return;
    }

    if (this.bulkUploadFileInfo && this.rejectQuestion.status !== QuestionStatus.REJECTED) {
      this.bulkUploadFileInfo.rejected = this.bulkUploadFileInfo.rejected + 1;
      this.store.dispatch(this.bulkUploadActions.updateBulkUpload(this.bulkUploadFileInfo));
    }

    this.rejectQuestion.status = QuestionStatus.REJECTED;
    this.rejectQuestion.reason = this.rejectFormGroup.get('reason').value;
    this.rejectQuestionStatus = false;
    this.rejectQuestion.approved_uid = this.user.userId;

    this.store.dispatch(this.questionActions.updateQuestion(this.rejectQuestion));
    this.rejectFormGroup.get('reason').setValue('');
  }

  editQuestions(row: Question) {
    this.editQuestion = row;
    this.createForm(row);
  }

  // Event Handlers
  addTag() {
    const tag = this.questionForm.get('tags').value;
    if (tag) {
      if (this.enteredTags.indexOf(tag) < 0) {
        this.enteredTags.push(tag);
      }
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
    if (this.questionForm.invalid) {
      return;
    }

    // get question object from the forms
    const question: Question = this.getQuestionFromFormValue(this.questionForm.value);

    question.id = this.editQuestion.id;
    question.status = this.editQuestion.status === QuestionStatus.REQUEST_TO_CHANGE ? QuestionStatus.PENDING : this.editQuestion.status;
    question.bulkUploadId = this.editQuestion.bulkUploadId ? this.editQuestion.bulkUploadId : '';
    question.categoryIds = [];

    if (Array.isArray(this.questionForm.get('category').value)) {
      question.categoryIds = this.questionForm.get('category').value;
    } else {
      question.categoryIds.push(this.questionForm.get('category').value);
    }


    question.reason = this.editQuestion.reason ? this.editQuestion.reason : '';
    question.published = this.editQuestion.published ? this.editQuestion.published : false;
    question.created_uid = this.editQuestion.created_uid ? this.editQuestion.created_uid : this.user.userId;
    question.approved_uid = this.editQuestion.approved_uid ? this.editQuestion.approved_uid : '';
    question.explanation = this.editQuestion.explanation ? this.editQuestion.explanation : '';
    // call saveQuestion
    this.updateQuestion(question);
  }

  // Helper functions
  getQuestionFromFormValue(formValue: any): Question {
    let question: Question;
    question = new Question();
    question.questionText = formValue.questionText;
    question.answers = formValue.answers;
    question.categoryIds = this.questionForm.get('category').value;
    question.tags = [...this.autoTags, ...this.enteredTags]
    question.ordered = formValue.ordered;
    question.explanation = formValue.explanation;
    return question;
  }

  updateQuestion(question: Question) {
    this.store.dispatch(this.questionActions.updateQuestion(question));
    this.editQuestion = null;
  }

  computeAutoTags() {
    const formValue = this.questionForm.value;
    const allTextValues: string[] = [formValue.questionText];
    formValue.answers.forEach(answer => allTextValues.push(answer.answerText));
    const wordString: string = allTextValues.join(' ');
    const matchingTags: string[] = [];
    this.tags.forEach(tag => {
      const part = new RegExp('\\b(' + tag.replace('+', '\\+') + ')\\b', 'ig');
      if (wordString.match(part)) {
        matchingTags.push(tag);
      }
    });
    this.autoTags = matchingTags;
    this.setTagsArray();
  }

  setTagsArray() {
    this.tagsArray.controls = [];
    [...this.autoTags, ...this.enteredTags].forEach(tag => this.tagsArray.push(new FormControl(tag)));
  }

  createForm(question: Question) {
    const fgs: FormGroup[] = question.answers.map(answer => {
      const fg = new FormGroup({
        answerText: new FormControl(answer.answerText, Validators.required),
        correct: new FormControl(answer.correct),
      });
      return fg;
    });
    const answersFA = new FormArray(fgs);
    let fcs: FormControl[] = question.tags.map(tag => {
      const fc = new FormControl(tag);
      return fc;
    });
    if (fcs.length === 0) {
      fcs = [new FormControl('')];
    }
    const tagsFA = new FormArray(fcs);

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

    this.questionForm.controls['category'].setValue(question.categoryIds);
    this.enteredTags = question.tags;
  }

  approveButtonClicked(question: Question) {
    this.onApproveClicked.emit(question)
  }
  pageChanged(pageEvent: PageEvent) {
    this.onPageChanged.emit(pageEvent);
  }
  sortOrderChanged(event: MatSelectChange) {
    this.onSortOrderChanged.emit(event.value);
  }
  ngOnDestroy() {
    Utils.unsubscribe(this.subs);
  }
}

export class QuestionsDataSource extends DataSource<Question> {
  constructor(private questionsObs: BehaviorSubject<Question[]>) {
    super();
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<Question[]> {
    return this.questionsObs;
  }

  disconnect() { }
}

// Custom Validators
function questionFormValidator(fg: FormGroup): { [key: string]: boolean } {
  const answers: Answer[] = fg.get('answers').value;
  if (answers.filter(answer => answer.correct).length !== 1) {
    return { 'correctAnswerCountInvalid': true }
  }
  const tags: string[] = fg.get('tagsArray').value;
  if (tags.length < 3) {
    return { 'tagCountInvalid': true }
  }
  return null;
}
