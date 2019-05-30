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
import { debounceTime, map } from 'rxjs/operators';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { QuestionService } from 'shared-library/core/services';
import { ImageCropperComponent } from 'ngx-img-cropper';
import { QuillImageUpload } from 'ng-quill-tex/lib/models/quill-image-upload';
import { PreviewQuestionDialogComponent } from './preview-question-dialog/preview-question-dialog.component';
import { CropImageDialogComponent } from 'shared-library/shared/components';

@Component({
  templateUrl: './question-add-update.component.html',
  styleUrls: ['./question-add-update.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})


@AutoUnsubscribe({ 'arrayName': 'subscriptions' })
export class QuestionAddUpdateComponent extends QuestionAddUpdate implements OnInit, OnDestroy {

  @ViewChild('cropper') cropper: ImageCropperComponent;
  dialogRef;

  get tagsArray(): FormArray {
    return this.questionForm.get('tagsArray') as FormArray;
  }
  subscriptions = [];
  htmlText: any;
  jsonObject: any;
  quillImageUrl: string;
  quillObject: any = {};

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
      if (appSettings) {
        this.applicationSettings = appSettings[0];
        this.quillConfig.toolbar.container.push(this.applicationSettings.quill_options.options);
        this.quillConfig.toolbar.container.push(this.applicationSettings.quill_options.list);
        this.createForm(this.question);
        this.quillConfig.mathEditor = { mathOptions: this.applicationSettings };
      }
    }));

    this.questionForm.get('isRichEditor').valueChanges.subscribe(isRichEditor => {
      setTimeout(() => {
        this.questionForm.patchValue({ questionText: '' });
        if (isRichEditor) {
          this.questionForm.get('maxTime').setValidators(Validators.compose([Validators.required]));
        } else {
          this.questionForm.get('maxTime').setValidators([]);
        }
        this.questionForm.get('maxTime').updateValueAndValidity();
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

  // Text change in quill editor
  onTextChanged(text) {
    this.quillObject.jsonObject = text.delta;
    this.quillObject.questionText = text.html;
  }

  // Image Upload
  fileUploaded(quillImageUpload: QuillImageUpload) {
    const file: File = quillImageUpload.file;

    this.dialogRef = this.dialog.open(CropImageDialogComponent, {
      disableClose: false,
      data: { file: file, applicationSettings: this.applicationSettings }
    });

    this.dialogRef.componentInstance.ref = this.dialogRef;
    this.subscriptions.push(this.dialogRef.componentInstance.ref.afterClosed().subscribe(result => {
      if (result) {
        const fileName = `questions/${new Date().getTime()}-${file.name}`;
        this.questionService.saveQuestionImage(result.image, fileName).subscribe(uploadTask => {
          if (uploadTask != null) {
            if (uploadTask.task.snapshot.state === 'success') {
              this.questionService.getQuestionDownloadUrl(fileName).subscribe(imageUrl => {
                quillImageUpload.setImage(imageUrl);
                this.cd.markForCheck();
              });
            }
          }
        });
      }
    }));
  }

  openDialog(file: File) {
    this.dialogRef = this.dialog.open(CropImageDialogComponent, {
      disableClose: false,
      data: { file: file, applicationSettings: this.applicationSettings }
    });

    this.dialogRef.componentInstance.ref = this.dialogRef;
    this.subscriptions.push(this.dialogRef.componentInstance.ref.afterClosed().subscribe(result => {
      if (result) {
        const fileName = `questions/${new Date().getTime()}-${file.name}`;
        this.questionService.saveQuestionImage(result.image, fileName).subscribe(uploadTask => {
          if (uploadTask != null) {
            if (uploadTask.task.snapshot.state === 'success') {
              this.questionService.getQuestionDownloadUrl(fileName).subscribe(imageUrl => {
                this.quillImageUrl = imageUrl;
                this.cd.markForCheck();
              });
            }
          }
        });
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
    this.question.questionText = this.quillObject.questionText;
    this.question.questionObject = this.quillObject.jsonObject;

    this.dialogRef = this.dialog.open(PreviewQuestionDialogComponent, {
      disableClose: false,
      data: { question: this.question }
    });

    this.dialogRef.componentInstance.ref = this.dialogRef;
    this.dialogRef.componentInstance.ref.afterClosed().subscribe(result => {

    });
    this.subscriptions.push(this.dialogRef.afterOpen().subscribe(x => {
      // this.renderer.addClass(document.body, 'dialog-open');
    }));
    this.subscriptions.push(this.dialogRef.afterClosed().subscribe(x => {
      // this.renderer.removeClass(document.body, 'dialog-open');
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
