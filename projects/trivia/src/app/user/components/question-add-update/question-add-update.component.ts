import { Component, OnDestroy, ChangeDetectionStrategy, ViewChild, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, FormControl, Validators } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { Utils } from 'shared-library/core/services';
import { AppState, appState } from '../../../store';
import { MatSnackBar, MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { QuestionActions } from 'shared-library/core/store/actions/question.actions';
import { QuestionAddUpdate } from './question-add-update';
import { Question, Answer } from 'shared-library/shared/model';
import { debounceTime, map, concatMap, mergeMap, take } from 'rxjs/operators';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { QuestionService } from 'shared-library/core/services';
import { ImageCropperComponent } from 'ngx-img-cropper';
import { QuillImageUpload } from 'ng-quill-tex/lib/models/quill-image-upload';
import { PreviewQuestionDialogComponent } from './preview-question-dialog/preview-question-dialog.component';
import { CropImageDialogComponent } from 'shared-library/shared/components';
import { of } from 'rxjs';

@Component({
  templateUrl: './question-add-update.component.html',
  styleUrls: ['./question-add-update.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})


@AutoUnsubscribe({ 'arrayName': 'subscriptions' })
export class QuestionAddUpdateComponent extends QuestionAddUpdate implements OnInit, OnDestroy {

  @ViewChild('cropper', { static: false }) cropper: ImageCropperComponent;
  dialogRef;

  get tagsArray(): FormArray {
    return this.questionForm.get('tagsArray') as FormArray;
  }

  htmlText: any;
  jsonObject: any;
  quillImageUrl: string;


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

  // Constructor
  constructor(public fb: FormBuilder,
    public store: Store<AppState>,
    public utils: Utils,
    public router: Router,
    public snackBar: MatSnackBar,
    public questionAction: QuestionActions,
    public questionService: QuestionService,
    public dialog: MatDialog,
    private cd: ChangeDetectorRef) {

    super(fb, store, utils, questionAction);

    this.question = new Question();
    this.subscriptions.push(this.store.select(appState.coreState).pipe(select(s => s.applicationSettings)).subscribe(appSettings => {
      if (appSettings && appSettings[0] && appSettings[0].quill_options) {
        this.applicationSettings = appSettings[0];
        // Add editor's options from app settings
        this.quillConfig.toolbar.container.push(this.applicationSettings.quill_options.options);
        this.quillConfig.toolbar.container.push(this.applicationSettings.quill_options.list);
        this.createForm(this.question);
        this.saveDraft();
        this.quillConfig.mathEditor = { mathOptions: this.applicationSettings };
      }
    }));

    this.subscriptions.push(this.questionForm.get('isRichEditor').valueChanges.subscribe(isRichEditor => {
      setTimeout(() => {
        this.questionForm.patchValue({ questionText: '' });
        if (isRichEditor) {
          this.questionForm.get('maxTime').setValidators(Validators.compose([Validators.required]));
          this.questionForm.get('questionText').setValidators(Validators.compose([Validators.required]));
        } else {
          this.questionForm.get('maxTime').setValidators([]);
          this.questionForm.get('questionText').setValidators(Validators.compose([Validators.required,
          Validators.maxLength(this.applicationSettings.question_max_length)]));
        }
        this.questionForm.get('maxTime').updateValueAndValidity();
        this.questionForm.get('questionText').updateValueAndValidity();
      }, 0);
    }));

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


  // Image Upload
  fileUploaded(quillImageUpload: QuillImageUpload) {

    if (!quillImageUpload.isMobile) {
      const file: File = quillImageUpload.file;

      this.dialogRef = this.dialog.open(CropImageDialogComponent, {
        disableClose: false,
        data: { file: file, applicationSettings: this.applicationSettings }
      });

      this.dialogRef.componentInstance.ref = this.dialogRef;

      this.subscriptions.push(this.dialogRef.componentInstance.ref.afterClosed()
        .pipe(mergeMap(result => {
          const fileName = `questions/${new Date().getTime()}-${file.name}`;
          return this.questionService.saveQuestionImage(result['image'], fileName);
        }),
          mergeMap(image => {
             return of(this.utils.getQuestionUrl(`${image['name']}`) + `?d=${new Date().getTime()}`);
          })
        ).subscribe(imageUrl => {
          // SetImage callback function called to set image in editor
          quillImageUpload.setImage(imageUrl);
          this.cd.markForCheck();
        }));
    }


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
      isRichEditor: [false],
      maxTime: []
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
      question.questionText = this.quillObject.questionText;
      question.questionObject = this.quillObject.jsonObject;
    }
    if (question) {
      // call saveQuestion
      this.saveQuestion(question);

      this.filteredTags$ = this.questionForm.get('tags').valueChanges
        .pipe(map(val => val.length > 0 ? this.filter(val) : []));
    }

  }

  ngOnDestroy() {
  }

  onAnswerChanged(event, answerIndex) {
    const answers = (<FormArray>this.questionForm.get('answers'));
    answers.controls[answerIndex]['controls'].answerObject.patchValue(event.delta);
    answers.controls[answerIndex]['controls'].answerText.patchValue(event.html);
  }

  preview() {
    this.question = super.onSubmit();
    if (this.question.isRichEditor) {
      this.question.questionText = this.quillObject.questionText;
      this.question.questionObject = this.quillObject.jsonObject;
    }

    this.dialogRef = this.dialog.open(PreviewQuestionDialogComponent, {
      disableClose: false,
      data: { question: this.question }
    });

    this.dialogRef.componentInstance.ref = this.dialogRef;
    this.subscriptions.push(this.dialogRef.componentInstance.ref.afterClosed().subscribe(result => {
    }));

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
