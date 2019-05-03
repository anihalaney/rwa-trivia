import { Component, OnDestroy, ChangeDetectionStrategy, ViewChild, OnInit } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, FormControl, Validators } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { Utils } from 'shared-library/core/services';
import { AppState, appState } from '../../../store';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { QuestionActions } from 'shared-library/core/store/actions/question.actions';
import { QuestionAddUpdate } from './question-add-update';
import { Question, Answer, Subscription } from 'shared-library/shared/model';
import { debounceTime, map } from 'rxjs/operators';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { QuillInitializeService } from 'shared-library/core/services/quillInitialize.service';
import { QuillEditorComponent } from 'ngx-quill';

@Component({
  templateUrl: './question-add-update.component.html',
  styleUrls: ['./question-add-update.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})


@AutoUnsubscribe({ 'arrayName': 'subscriptions' })
export class QuestionAddUpdateComponent extends QuestionAddUpdate implements OnInit, OnDestroy {

  get tagsArray(): FormArray {
    return this.questionForm.get('tagsArray') as FormArray;
  }
  subscriptions = [];
  htmlText: any;
  objectFormat = [
    { insert: { formula: '6\\sqrt{-753+\\sqrt{355}}' } },
    { insert: 'World!', attributes: { bold: true } },
    { insert: '\n' }
  ];
  jsonObject: any;
  @ViewChild('quillEditior') quillEditior: QuillEditorComponent;
  public editorConfig = {
    placeholder: 's'
  };
  quillConfig = {
    // toolbar: '.toolbar',
    toolbar: {
      // ['formula'],
      // container: "#customToolbar",
      container: [
        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
        ['code-block'],
        [{ 'header': 1 }, { 'header': 2 }],               // custom button values
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
        [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
        [{ 'direction': 'rtl' }],                         // text direction

        [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

        [{ 'font': [] }],
        [{ 'align': [] }],
        ['clean'],
        ['autoLink'],
      ],
      autoLink: true,
      handlers: {
        // handlers object will be merged with default handlers object
        'autoLink': function () {
          console.log('handler called');
        }
      }
    },
    autoLink: true,
  };

  // Constructor
  constructor(public fb: FormBuilder,
    public store: Store<AppState>,
    public utils: Utils,
    public router: Router,
    public snackBar: MatSnackBar,
    public questionAction: QuestionActions,
    public quillInitializeService: QuillInitializeService) {

    super(fb, store, utils, questionAction);

    this.question = new Question();
    this.subscriptions.push(this.store.select(appState.coreState).pipe(select(s => s.applicationSettings)).subscribe(appSettings => {
      if (appSettings) {
        this.applicationSettings = appSettings[0];
        this.createForm(this.question);
      }
    }));

    this.questionForm.get('questionText').valueChanges.subscribe(val => {
      console.log('value is here', val);
    });

    this.questionForm.get('isRichEditor').valueChanges.subscribe(isRichEditor => {

      if (isRichEditor) {
        setTimeout(() => {
          this.quillEditior
            .onContentChanged
            .pipe(
              debounceTime(400),
            )
            .subscribe((data) => {
              // tslint:disable-next-line:no-console
              console.log('view child + directly subscription', data);
              this.question.questionObject = data.html;
              this.jsonObject = data.content.ops;
            });
        }, 0);
      }
      setTimeout(() => {
        this.questionForm.patchValue({ questionText: '' });
      }, 0);

    });

    const questionControl = this.questionForm.get('questionText');

    this.subscriptions.push(questionControl.valueChanges.pipe(debounceTime(500)).subscribe(v => this.computeAutoTags()));
    this.subscriptions.push(this.answers.valueChanges.pipe(debounceTime(500)).subscribe(v => this.computeAutoTags()));


    this.filteredTags$ = this.questionForm.get('tags').valueChanges
      .pipe(map(val => val.length > 0 ? this.filter(val) : []));

    this.subscriptions.push(store.select(appState.coreState).pipe(select(s => s.questionSaveStatus)).subscribe((status) => {
      if (status === 'SUCCESS') {
        this.snackBar.open('Question saved!', '', { duration: 2000 });
        this.router.navigate(['/user/my/questions']);
        this.store.dispatch(this.questionAction.resetQuestionSuccess());
      }
    }));
  }

  ngOnInit(): void {
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
      questionText: ['',
        Validators.compose([Validators.required, Validators.maxLength(this.applicationSettings.question_max_length)])],
      tags: '',
      tagsArray: tagsFA,
      answers: answersFA,
      ordered: [question.ordered],
      explanation: [question.explanation],
      isRichEditor: [false],
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
    if (question.isRichEditor) {
      const questionObject = this.jsonObject;
      question.questionText = this.question.questionObject;
      question.questionObject = questionObject;
    }
    console.log('question>', question);
    // console.log('this quesiton', this.question);
    if (question) {
      // call saveQuestion
      this.saveQuestion(question);

      this.filteredTags$ = this.questionForm.get('tags').valueChanges
        .pipe(map(val => val.length > 0 ? this.filter(val) : []));
    }

  }

  ngOnDestroy() {

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
