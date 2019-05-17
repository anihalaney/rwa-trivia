import { Component, OnDestroy, ChangeDetectionStrategy, ViewChild, OnInit } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, FormControl, Validators } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { Utils } from 'shared-library/core/services';
import { AppState, appState } from '../../../store';
import { MatSnackBar, MatDialogRef, MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { QuestionActions } from 'shared-library/core/store/actions/question.actions';
import { QuestionAddUpdate } from './question-add-update';
import { Question, Answer, Subscription } from 'shared-library/shared/model';
import { debounceTime, map, finalize } from 'rxjs/operators';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { QuillInitializeService } from 'shared-library/core/services/quillInitialize.service';
import { QuillEditorComponent } from 'ngx-quill';
import Quill from 'quill';
import BlotFormatter from 'quill-blot-formatter';
import { ImageUpload } from 'quill-image-upload';
import { QuestionService } from 'shared-library/core/services';
import { WindowRef } from 'shared-library/core/services';
import { CONFIG } from 'shared-library/environments/environment';
import { CropperSettings, ImageCropperComponent } from 'ngx-img-cropper';
import { CropImageDialogComponent } from './crop-image-dialog/crop-image-dialog.component';


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
  objectFormat = [
    { insert: { formula: '6\\sqrt{-753+\\sqrt{355}}' } },
    { insert: 'World!', attributes: { bold: true } },
    { insert: '\n' }
  ];
  jsonObject: any;
  quillEditorRef;
  quillImageUrl: string;

  @ViewChild('quillEditior') quillEditior: QuillEditorComponent;
  public editorConfig = {
    placeholder: 's'
  };

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
    syntax: true,
    imageUpload: {
      customUploader: (file) => {
        this.openDialog(file);
      }
    }
  };

  // Constructor
  constructor(public fb: FormBuilder,
    public store: Store<AppState>,
    public utils: Utils,
    public router: Router,
    public snackBar: MatSnackBar,
    public questionAction: QuestionActions,
    public quillInitializeService: QuillInitializeService,
    public questionService: QuestionService,
    public dialog: MatDialog) {

    super(fb, store, utils, questionAction);

    Quill.register('modules/imageUpload', ImageUpload);
    Quill.register('modules/blotFormatter', BlotFormatter);

    this.question = new Question();
    this.subscriptions.push(this.store.select(appState.coreState).pipe(select(s => s.applicationSettings)).subscribe(appSettings => {
      if (appSettings) {
        this.applicationSettings = appSettings[0];
        this.quillConfig.toolbar.container.push(this.applicationSettings.quill_options.options);
        this.quillConfig.toolbar.container.push(this.applicationSettings.quill_options.list);
        this.createForm(this.question);
        this.quillConfig.mathEditor = { applicationSettings: this.applicationSettings };
      }
    }));

    this.questionForm.get('isRichEditor').valueChanges.subscribe(isRichEditor => {

      if (isRichEditor) {
        setTimeout(() => {
          this.quillEditior
            .onContentChanged
            .pipe(
              debounceTime(400),
            )
            .subscribe((data) => {
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


  quilHtml(html) {
    console.log('html called', html);
  }

  quilDelta(delta) {
    console.log('delta>>>', delta);
  }

  fileuploaded(file) {
    // console.log('image uploadede', file);
    this.openDialog(file);
    // console.log('file');
  }
  openDialog(file: File) {
    this.dialogRef = this.dialog.open(CropImageDialogComponent, {
      disableClose: false,
      data: { file: file, applicationSettings: this.applicationSettings }
    });

    this.dialogRef.componentInstance.ref = this.dialogRef;
    this.dialogRef.componentInstance.ref.afterClosed().subscribe(result => {
      if (result) {
        const fileName = `questions/${new Date().getTime()}-${file.name}`;
        this.questionService.saveQuestionImage(result.image, fileName).subscribe(uploadTask => {
          if (uploadTask != null) {
            if (uploadTask.task.snapshot.state === 'success') {
              this.questionService.getQuestionDownloadUrl(fileName).subscribe(imageUrl => {
                // const range = this.quillEditorRef.getSelection();
                // const imageIndex = range.index;
                // this.quillEditorRef.insertEmbed(imageIndex, 'image', imageUrl);
                this.quillImageUrl = imageUrl;
                console.log('image URL', this.quillImageUrl);

                // console.log(this.quillEditorRef.getLength());
              });
            }
          }
        });
      }
    });
    this.subscriptions.push(this.dialogRef.afterOpen().subscribe(x => {
      // this.renderer.addClass(document.body, 'dialog-open');
    }));
    this.subscriptions.push(this.dialogRef.afterClosed().subscribe(x => {
      // this.renderer.removeClass(document.body, 'dialog-open');
    }));
  }

  ngOnInit(): void {

    setTimeout(() => {
      this.quillImageUrl = 'fileupdated';
    }, 2000);
    setTimeout(() => {
      this.quillImageUrl = 'fileupdated 4';
    }, 4000);

    setTimeout(() => {
      this.quillImageUrl = 'fileupdated 6';
    }, 6000);

  }

  getEditorInstance(editorInstance: any) {
    this.quillEditorRef = editorInstance;
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
