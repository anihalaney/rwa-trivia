import { Component, OnInit, ChangeDetectorRef, NgZone, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { AppState, appState,  } from './../store';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { ApplicationSettings, Question, Answer, Category } from 'shared-library/shared/model';
import { Subscription, Observable } from 'rxjs';
import { FormGroup, FormArray, FormControl, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-add-question',
  templateUrl: './add-question.component.html',
  styleUrls: ['./add-question.component.scss']
})

@AutoUnsubscribe({ 'arrayName': 'subscriptions' })
export class AddQuestionComponent implements OnInit, OnDestroy {

  editorContent = [{ insert: '' }];
  applicationSettings: ApplicationSettings;
  show = false;
  quillImageUrl = '';
  quillImageUrlAnswer = '';
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

  get answers(): FormArray {
    return this.questionForm.get('answers') as FormArray;
  }

  

  constructor(private store: Store<AppState>,
    private cd: ChangeDetectorRef,
    private ngZone: NgZone,
    public fb: FormBuilder) {
    this.subscriptions.push(this.store.select(appState.coreState).pipe(select(s => s.applicationSettings)).subscribe(appSettings => {
      if (appSettings[0]) {
        this.applicationSettings = appSettings[0];
        this.createForm(this.question);
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
         
          this.createForm(this.question);
          this.show = true;
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
    this.questionForm = this.fb.group({
      id: '',
      is_draft: false,
      category: [(question.categories.length > 0 ? question.categories[0] : ''), Validators.required],
      questionText: ['',
        Validators.compose([Validators.required, Validators.maxLength(this.applicationSettings.question_max_length)])],
      tags: '',
      tagsArray: tagsFA,
      answers: answersFA,
      ordered: [question.ordered],
      explanation: [question.explanation],
      isRichEditor: [true],
      maxTime: []
    }, { validator: questionFormValidator }
    );
  }

  createDefaultForm(question: Question, isRichEditor = false): FormArray {
    const fgs: FormGroup[] = question.answers.map(answer => {
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
  
  onAnswerChanged(event,answerIndex){
    console.log('event', event, ' answer index', answerIndex);
  }

  ngOnInit() {

    if (this.oWebViewInterface) {
      this.oWebViewInterface.on('answerIndex', (answerIndex) => {
        this.ngZone.run(() => {
          // this.answerIndex = answerIndex;
          // this.cd.detectChanges();
        });
      });

      this.oWebViewInterface.on('imageUrl', (url) => {
        this.ngZone.run(() => {
          this.quillImageUrl = url;
        });
      });

      this.oWebViewInterface.on('deltaObject', (deltaObject) => {
        this.ngZone.run(() => {
          // this.editorContent = deltaObject;
          // this.cd.detectChanges();
        });
      });


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

      this.oWebViewInterface.on('viewType', (viewType) => {
        // this.ngZone.run(() => {
        //   this.viewType = viewType;
        //   if (this.applicationSettings && this.applicationSettings.quill_options) {
        //     const dispOptions = Object.keys(this.viewType === 'question' ?
        //       this.applicationSettings.quill_options.web_view_question_options :
        //       this.applicationSettings.quill_options.web_view_answer_options);
        //       Array.from(this.bottomToolBar.nativeElement.children).forEach((ele: any) => {
        //         const newele = ele as HTMLElement;
        //         if (dispOptions.indexOf(ele.className) === -1) {
        //           newele.style.display = 'none';
        //         } else {
        //           newele.style.display = 'block';
        //         }
        //       });
        //   }
        // });
      });
    }
  }

  // emit editor load finished event
  editorLoadFinished(event) {
    console.log('Image upload>>>');
    this.ngZone.run(() => {
      this.oWebViewInterface.emit('editorLoadFinished', event);
      this.cd.detectChanges();
    });
  }

  // Text change in quill editor
  onTextChanged(text) {
    // this.ngZone.run(() => {
    //   text.answerIndex = this.answerIndex;
    //   this.oWebViewInterface.emit('quillContent', text);
    //   this.text = text;
    //   this.cd.detectChanges();
    // });

  }
  // Image Upload
  fileUploaded(quillImageUpload: any) {
    console.log('file uploaded');
    if (quillImageUpload.isMobile) {
      this.oWebViewInterface.emit('uploadImageStart', true);
    }
  }

  imageUpload() {
    // this.oWebViewInterface.emit('uploadImageStart', true);
  }

  ngOnDestroy() {
    // this.oWebViewInterface.off('answerIndex');
    // this.oWebViewInterface.off('imageUrl');
    // this.oWebViewInterface.off('deltaObject');
    // this.oWebViewInterface.off('viewType');
  }

}

function questionFormValidator(fg: FormGroup): { [key: string]: boolean } {
  const answers: Answer[] = fg.get("answers").value;
  if (
    fg.get("isRichEditor").value &&
    (fg.get("maxTime").value === 0 || fg.get("maxTime").value === null)
  ) {
    return { maxTimeNotSelected: true };
  }

  if (answers.filter(answer => answer.correct).length !== 1) {
    return { correctAnswerCountInvalid: true };
  }
}

