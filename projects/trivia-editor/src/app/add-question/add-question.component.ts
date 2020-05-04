import { Component, OnInit, ChangeDetectorRef, NgZone, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { AppState, appState, } from './../store';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { ApplicationSettings, Question, Answer, Category, QuestionStatus } from 'shared-library/shared/model';
import { Subscription, Observable } from 'rxjs';
import { FormGroup, FormArray, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Utils } from 'shared-library/core/services';
import { map } from 'rxjs/operators';


@Component({
  selector: 'app-add-question',
  templateUrl: './add-question.component.html',
  styleUrls: ['./add-question.component.scss']
})

@AutoUnsubscribe({ 'arrayName': 'subscriptions' })
export class AddQuestionComponent implements OnInit, OnDestroy, AfterViewInit {

  editorContent = [{ insert: '' }];
  applicationSettings: ApplicationSettings;
  show = false;
  quillImageUrl = '';
  quillImageUrlAnswer = '';
  answerImageUrl = '';
  answerIndex: number;
  public oWebViewInterface = (window as any).nsWebViewInterface;
  quillConfig = {
    toolbar: {
      container: [],
      handlers: {
        // handlers object will be merged with default handlers object
        'mathEditor': () => {
        }
      }
    },
    mathEditor: {},
    blotFormatter: {},
    syntax: true
  };
  fileUploadFor = '';

  quillConfigAnswer = {
    toolbar: {
      container: [],
      handlers: {
        // handlers object will be merged with default handlers object
        'mathEditor': () => {
        }
      }
    },
    mathEditor: {},
    blotFormatter: {},
    syntax: true
  };
  subscriptions: Subscription[] = [];
  viewType = 'question';
  bottomBarOptions = '';
  bottomBarAnswerOption = '';
  text = '';
  // @ViewChild('bottomToolBar', { static: false }) bottomToolBar: ElementRef;

  questionForm: FormGroup;
  question = new Question();

  tagsObs: Observable<string[]>;
  categoriesObs: Observable<Category[]>;
  isMobile = false;

  // Properties
  categories: Category[];
  questionCategories: Array<string> = [];
  tags: string[];
  selectedQuestionCategoryIndex = 0;
  autoTags: string[] = []; // auto computed based on match within Q/A
  enteredTags: string[] = [];
  filteredTags$: Observable<string[]>;
  questionObject: any;
  quillObject: any = {};
  answerTexts = [];

  editQuestion: Question;

  get answers(): FormArray {
    return this.questionForm.get('answers') as FormArray;
  }

  get tagsArray(): FormArray {
    return this.questionForm.get('tagsArray') as FormArray;
  }


  constructor(private store: Store<AppState>,
    private cd: ChangeDetectorRef,
    private ngZone: NgZone,
    public fb: FormBuilder,
    public utils: Utils) {
    this.subscriptions.push(this.store.select(appState.coreState).pipe(select(s => s.applicationSettings)).subscribe(appSettings => {
      if (appSettings[0]) {
        this.applicationSettings = appSettings[0];

        if (this.applicationSettings && this.applicationSettings.quill_options) {
          this.quillConfig.toolbar.container.push(this.applicationSettings.quill_options.list);
          this.quillConfig.mathEditor = { mathOptions: this.applicationSettings };

          if (this.applicationSettings.quill_options.custom_toolbar_position === 'bottom') {
            if (this.viewType === 'question') {
              this.bottomBarOptions = Object.values(this.applicationSettings.quill_options.web_view_question_options).join('');
            } else {

            }
            this.bottomBarAnswerOption = Object.values(this.applicationSettings.quill_options.web_view_answer_options).join('');
            this.quillConfigAnswer.toolbar.container.push(this.applicationSettings.quill_options.web_view_answer_options);

          } else {
            if (this.viewType === 'question') {
              this.quillConfig.toolbar.container.push(this.applicationSettings.quill_options.web_view_question_options);
            } else {
              this.quillConfig.toolbar.container.push(this.applicationSettings.quill_options.web_view_answer_options);
            }
          }

          this.oWebViewInterface.emit('appIsLoaded', 'appIsLoaded');

          // this.createForm(this.question);

        }
      }
    }));

    this.categoriesObs = store.select(appState.coreState).pipe(select(s => s.categories));
    this.tagsObs = store.select(appState.coreState).pipe(select(s => s.tags));


    this.subscriptions.push(this.categoriesObs.subscribe(categories => {
      this.categories = categories;
      this.questionCategories = this.categories.map(category => category.categoryName);

      this.questionCategories.push('Select Preferred Category');
      this.selectedQuestionCategoryIndex = this.questionCategories.length - 1;
    }
    ));
    this.subscriptions.push(this.tagsObs.subscribe(tags => this.tags = tags));

  }


  createForm(question: Question) {

    const answersFA: FormArray = this.createDefaultForm(question);

    let fcs: FormControl[] = question.tags.map(tag => {
      const fc = new FormControl(tag);
      return fc;
    });
    if (fcs.length === 0) {
      fcs = [new FormControl('')];
    }

    const tagsFA = new FormArray(fcs);
    this.questionObject =  question.questionObject;

    if (question.isRichEditor) {
      this.quillObject.questionText = question.questionText;
      this.quillObject.jsonObject = question.questionObject;
    }

    this.questionForm = this.fb.group({
      id: (question.id) ? question.id : '',
      is_draft: false,
      status: (question.status) ? question.status : QuestionStatus.PENDING,
      category: [(question.categoryIds.length > 0 ? question.categoryIds[0] : ''), Validators.required],
      questionText: [question.questionText,
      Validators.compose([Validators.required])],
      tags: '',
      tagsArray: tagsFA,
      answers: answersFA,
      ordered: [question.ordered],
      explanation: [question.explanation],
      isRichEditor: [true],
      maxTime: []
    }, { validator: questionFormValidator }
    );
    this.filteredTags$ = this.questionForm.get('tags').valueChanges
      .pipe(map(val => val.length > 0 ? this.filter(val) : []));

    this.subscriptions.push(this.questionForm.valueChanges.subscribe(() => {
    this.oWebViewInterface.emit('isFormValid', this.questionForm.valid);
    }));

    this.enteredTags = question.tags;
    this.cd.markForCheck();
    this.show = true;
  }

  createDefaultForm(question: Question, isRichEditor = false): FormArray {

    const fgs: FormGroup[] = question.answers.map((answer, index) => {
      this.answerTexts[index] = answer.answerObject;
      const fg = new FormGroup({
        answerText: new FormControl(answer.answerText ? answer.answerText : '',
          Validators.compose([Validators.required])),
        correct: new FormControl(answer.correct),
        isRichEditor: new FormControl(true),
        answerObject: new FormControl(answer.answerObject),
      });
      return fg;
    });
    const answersFA = new FormArray(fgs);
    return answersFA;
  }

  onAnswerChanged(event, answerIndex) {

    const ansForm = (<FormArray>this.questionForm.controls["answers"]).at(
      answerIndex
    );
    ansForm["controls"].answerText.patchValue(
      event.html ? event.html : ""
    );
    ansForm["controls"].answerObject.patchValue(event.delta);
    this.questionForm.controls["answers"].markAllAsTouched();
    this.computeAutoTags();
    
    const question: Question = this.getQuestionFromFormValue(this.questionForm.value);


  }

  ngOnInit() {

    if (this.oWebViewInterface) {

      this.oWebViewInterface.on('getFormData', (getFormData) => {

        const question: Question = this.getQuestionFromFormValue(this.questionForm.value);

        this.oWebViewInterface.emit('question', question);

      });

      this.oWebViewInterface.on('getPreviewQuestion', (getPreviewQuestion) => {
        const question: Question = this.getQuestionFromFormValue(this.questionForm.value);
        this.oWebViewInterface.emit('previewQuestion', question);
      });

      this.oWebViewInterface.on('editQuestion', (editQuestion) => {

        this.ngZone.run(() => {

          this.createForm(editQuestion);
          this.editQuestion = editQuestion;
          this.question.status = editQuestion.status;
          this.cd.markForCheck();
        });
      });

      this.oWebViewInterface.on('imageUrl', (url) => {
        this.ngZone.run(() => {
          if (this.answerIndex >= 0) {
            this.answerImageUrl = url;
          } else {
            this.quillImageUrl = url;
          }
          // });
          setTimeout(() => {
            if (this.answerIndex >= 0) {
              this.quillImageUrl = '';
              this.answerImageUrl = '';
            } else {
              this.quillImageUrl = '';
            }
            this.answerIndex = undefined;
          }, 3);

        });
      });

      this.createForm(this.editQuestion);
      this.cd.markForCheck();

      this.oWebViewInterface.on('quillConfig', (quillConfig) => {
        this.ngZone.run(() => {
          this.applicationSettings.quill_options = JSON.parse(quillConfig);
          this.quillConfig.toolbar.container = [];
          this.quillConfig.mathEditor = {};
          this.quillConfig.toolbar.container.push(this.applicationSettings.quill_options.options);
          this.quillConfig.toolbar.container.push(this.applicationSettings.quill_options.list);
          this.quillConfig.mathEditor = { mathOptions: this.applicationSettings };
        });
      });
    }


    this.ngZone.run(() => {
      this.cd.markForCheck();
    });
  }

  // emit editor load finished event
  editorLoadFinished(event) {
    if (this.editQuestion) {
      // this.createForm(this.editQuestion);
    }
    this.ngZone.run(() => {
      this.oWebViewInterface.emit('editorLoadFinished', event);
      this.cd.detectChanges();
    });
  }

  // Text change in quill editor

  onTextChanged(quillContent) {
    this.quillObject.jsonObject = quillContent.delta;
    this.quillObject.questionText = quillContent.html;
    this.computeAutoTags();
    if(quillContent.imageParsedName){
      //     this.store.dispatch(this.questionAction.deleteQuestionImage(text.imageParsedName));
      this.oWebViewInterface.emit('deleteImageUrl', quillContent.imageParsedName);
    }
    this.questionForm.controls.questionText.markAsTouched();
    this.questionForm.controls.questionText.patchValue(quillContent.html);

  }
  // Image Upload
  fileUploaded(quillImageUpload: any, fileUploadFor, answerIndex = -1) {

    this.fileUploadFor = fileUploadFor;
    if (quillImageUpload.isMobile) {
      this.oWebViewInterface.emit('uploadImageStart', true);
    }
    this.answerIndex = answerIndex;

  }


  ngOnDestroy() {
    this.oWebViewInterface.off('imageUrl');
    this.oWebViewInterface.off('getFormData');
    this.oWebViewInterface.off('getPreviewQuestion');
    this.oWebViewInterface.off('editQuestion');
    this.oWebViewInterface.off('quillConfig');
  }

  // Helper functions
  getQuestionFromFormValue(formValue: any): Question {
    let question: Question;

    question = new Question();
    if (formValue.id) {
      question.id = formValue.id;
    }

    question.questionText = formValue.questionText;
    question.answers = formValue.answers;
    question.categoryIds = (formValue.category >= 0) ? [formValue.category] : [];
    question.tags = [...this.autoTags, ...this.enteredTags];
    question.ordered = formValue.ordered;
    question.explanation = formValue.explanation;
    question.createdOn = new Date();
    question.isRichEditor = formValue.isRichEditor;
    question.maxTime = formValue.maxTime;
    question.status = formValue.status ? formValue.status : QuestionStatus.PENDING;

    if (question.isRichEditor) {
      question.questionText = this.quillObject.questionText;
      question.questionObject = this.quillObject.jsonObject;
    }

    return question;
  }

  addTag() {
    const tag = this.questionForm.get('tags').value;
    if (tag) {
      if (this.enteredTags.indexOf(tag) < 0) {
        this.enteredTags.push(tag);
        this.questionForm.patchValue({ tags: [] });
      }
      this.questionForm.get('tags').setValue('');
    }
    this.setTagsArray();
  }

  setTagsArray() {
    this.tagsArray.controls = [];
    [...this.autoTags, ...this.enteredTags].forEach(tag => this.tagsArray.push(new FormControl(tag)));
  }
  removeEnteredTag(tag) {
    this.enteredTags = this.enteredTags.filter(t => t !== tag);
    this.questionForm.patchValue({ tags: [] });
    this.setTagsArray();
    console.log("479", this.questionForm.valid);
    this.oWebViewInterface.emit('isFormValid', !this.questionForm.hasError('tagCountInvalid'));
  }

  filter(val: string): string[] {
    return this.tags.filter(option => new RegExp(this.utils.regExpEscape(`${val}`), 'gi').test(option));
  }


  ngAfterViewInit(): void {

  }

  computeAutoTags() {
    const formValue = this.questionForm.value;

    const allTextValues: string[] = [formValue.questionText];
    formValue.answers.forEach(answer => allTextValues.push(answer.answerText));
    if(formValue.isRichEditor && this.quillObject && this.quillObject.questionText){
      const removedHtmlTag = this.quillObject.questionText.replace( /(<([^>]+)>)/ig, '');
      allTextValues.push(removedHtmlTag);  
    }
    const wordString: string = allTextValues.join(" ");

    const matchingTags: string[] = [];
    this.tags.forEach(tag => {
      const patt = new RegExp('\\b(' + tag.replace("+", "\\+") + ')\\b', "ig");
      if (wordString.match(patt)) {
        if (this.enteredTags.indexOf(tag) === -1) {
          matchingTags.push(tag);
        }
      }
    });
    this.autoTags = matchingTags;
    this.questionForm.patchValue({ tags: [] });
    this.setTagsArray();
  }

}

function questionFormValidator(fg: FormGroup): { [key: string]: boolean } {
  const answers: Answer[] = fg.get("answers").value;

  if (answers.filter(answer => answer.correct).length !== 1) {
    return { correctAnswerCountInvalid: true };
  }
  const tags: string[] = fg.get('tagsArray').value;
  if (tags.length < 3) {
    return { 'tagCountInvalid': true };
  }
}

