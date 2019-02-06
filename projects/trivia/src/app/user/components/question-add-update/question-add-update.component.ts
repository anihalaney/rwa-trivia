import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, FormControl, Validators } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { Utils } from 'shared-library/core/services';
import { AppState, appState } from '../../../store';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { QuestionActions } from 'shared-library/core/store/actions/question.actions';
import { QuestionAddUpdate } from './question-add-update';
import { Question, Answer } from 'shared-library/shared/model';
import { debounceTime, map } from 'rxjs/operators';

@Component({
  templateUrl: './question-add-update.component.html',
  styleUrls: ['./question-add-update.component.scss']
})

export class QuestionAddUpdateComponent extends QuestionAddUpdate implements OnDestroy {

  get tagsArray(): FormArray {
    return this.questionForm.get('tagsArray') as FormArray;
  }


  // Constructor
  constructor(public fb: FormBuilder,
    public store: Store<AppState>,
    public utils: Utils,
    public router: Router,
    public snackBar: MatSnackBar,
    public questionAction: QuestionActions) {

    super(fb, store, utils, questionAction);

    this.question = new Question();
    this.subs.push(this.store.select(appState.coreState).pipe(select(s => s.applicationSettings)).subscribe(appSettings => {
      if (appSettings) {
        this.applicationSettings = appSettings[0];
        this.createForm(this.question);
      }
    }));


    const questionControl = this.questionForm.get('questionText');

    questionControl.valueChanges.pipe(debounceTime(500)).subscribe(v => this.computeAutoTags());
    this.answers.valueChanges.pipe(debounceTime(500)).subscribe(v => this.computeAutoTags());


    this.filteredTags$ = this.questionForm.get('tags').valueChanges
      .pipe(map(val => val.length > 0 ? this.filter(val) : []));

    this.subs.push(store.select(appState.coreState).pipe(select(s => s.questionSaveStatus)).subscribe((status) => {
      if (status === 'SUCCESS') {
        this.snackBar.open('Question saved!', '', { duration: 2000 });
        this.router.navigate(['/my/questions']);
        this.store.dispatch(this.questionAction.resetQuestionSuccess());
      }
    }));
  }



  createForm(question: Question) {

    const answersFA: FormArray = super.createDefaultForm(question);

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
      questionText: [question.questionText,
      Validators.compose([Validators.required, Validators.maxLength(this.applicationSettings.question_max_length)])],
      tags: '',
      tagsArray: tagsFA,
      answers: answersFA,
      ordered: [question.ordered],
      explanation: [question.explanation]
    }, { validator: questionFormValidator }
    );
  }


  // Event Handlers
  addTag() {
    const tag = this.questionForm.get('tags').value;
    if (tag) {
      super.addTag(tag);
      this.questionForm.get('tags').setValue('');
    }
    this.setTagsArray();
  }

  removeEnteredTag(tag) {
    super.removeEnteredTag(tag);
    this.setTagsArray();
  }


  computeAutoTags() {
    super.computeAutoTags();
    this.setTagsArray();
  }

  setTagsArray() {
    this.tagsArray.controls = [];
    [...this.autoTags, ...this.enteredTags].forEach(tag => this.tagsArray.push(new FormControl(tag)));
  }

  submit() {

    const question: Question = super.onSubmit();

    if (question) {
      // call saveQuestion
      this.saveQuestion(question);

      this.filteredTags$ = this.questionForm.get('tags').valueChanges
        .pipe(map(val => val.length > 0 ? this.filter(val) : []));
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

  const tags: string[] = fg.get('tagsArray').value;
  if (tags.length < 3) {
    return { 'tagCountInvalid': true };
  }

  return null;
}
