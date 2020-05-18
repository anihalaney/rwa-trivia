import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import {
  Category, User, Question, QuestionStatus, BulkUploadFileInfo, BulkUpload, ApplicationSettings
} from 'shared-library/shared/model';
import { Utils } from 'shared-library/core/services';
import { AppState, appState } from '../../../store';
import { Papa } from 'ngx-papaparse';
import * as bulkActions from '../../../bulk/store/actions';
import { AutoUnsubscribe } from 'shared-library/shared/decorators';

@Component({
  selector: 'bulk-upload',
  templateUrl: './bulk-upload.component.html',
  styleUrls: ['./bulk-upload.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

@AutoUnsubscribe({ 'arrayName': 'subscriptions' })
export class BulkUploadComponent implements OnInit, OnDestroy {

  primaryTag;
  primaryTagOld;
  isLinear = true;
  uploadFormGroup: FormGroup;

  tagsObs: Observable<string[]>;
  categoriesObs: Observable<Category[]>;
  fileParseError = false;
  fileParseErrorMessage: String;
  questionValidationError = false;
  bulkUploadFileInfo: BulkUploadFileInfo;
  file: File;

  // Properties
  categories: Category[];

  tags: string[];
  filteredTags$: Observable<string[]>;

  // Question List
  questions: Array<Question> = [];
  // user Object
  user: User;
  // bulk upload object
  parsedQuestions: Array<Question> = [];

  // Show Instruction Card
  showInstructions: Boolean = true;
  myTabIndex: Number = 0;
  subscriptions = [];
  // application Settings
  applicationSettings: ApplicationSettings;

  constructor(private fb: FormBuilder,
    private store: Store<AppState>, private papa: Papa,
    private utils: Utils, private cd: ChangeDetectorRef) {
    this.categoriesObs = store.select(appState.coreState).pipe(select(s => s.categories));
    this.tagsObs = store.select(appState.coreState).pipe(select(s => s.tags));
    this.subscriptions.push(this.store.select(appState.coreState).pipe(take(1)).subscribe(s => {
       this.user = s.user;
       this.cd.markForCheck();
    }));
  }

  ngOnInit() {
    this.subscriptions.push(this.categoriesObs.subscribe(categories => {
      this.categories = categories;
      this.cd.markForCheck();
    }));
    this.subscriptions.push(this.tagsObs.subscribe(tags => {
     this.tags = tags;
     this.cd.markForCheck();
    }));

    this.uploadFormGroup = this.fb.group({
      category: ['', Validators.required],
      tagControl: [''],
      csvFile: [null, Validators.required]
    });

    this.filteredTags$ = this.uploadFormGroup.get('tagControl').valueChanges
      .pipe(map(val => val.length > 0 ? this.filter(val) : []));

    this.subscriptions.push(this.store.select(appState.coreState).pipe(select(s => s.applicationSettings)).subscribe(appSettings => {
      if (appSettings) {
        this.applicationSettings = appSettings[0];
      }
      this.cd.markForCheck();
    }));
  }

  filter(val: string): string[] {
    return this.tags.filter(option => new RegExp(this.utils.regExpEscape(`${val}`), 'gi').test(option));
  }

  onFileChange(event) {
    const reader = new FileReader();
    this.fileParseError = false;
    if (event.target.files && event.target.files.length > 0) {
      const file = this.file = event.target.files[0];
      this.uploadFormGroup.get('csvFile').setValue(file);
      reader.readAsText(file);
      reader.onload = () => {
        this.bulkUploadFileInfo = new BulkUploadFileInfo();
        this.questions = [];
        this.parsedQuestions = [];
        this.primaryTag = this.primaryTagOld = '';
        this.bulkUploadFileInfo.fileName = file['name'];
        this.generateQuestions(reader.result);
      };
    }

  }

  generateQuestions(csvString: any): void {
    this.questionValidationError = false;
    this.fileParseError = false;
    this.fileParseErrorMessage = '';

    this.papa.parse(csvString, {
      complete: (result) => {
        const output = result.data;
        const validColumns = ['Question', 'Option 1', 'Option 2', 'Option 3', 'Option 4', 'Answer Index', 'Tag 1', 'Tag 2', 'Tag 3',
          'Tag 4', 'Tag 5', 'Tag 6', 'Tag 7', 'Tag 8', 'Tag 9'];
        if (validColumns.toString() !== result.meta.fields.toString()) {
          this.fileParseError = true;
          this.fileParseErrorMessage = 'File format is not correct, must be in CSV format, must not have missing or wrong column order.';
          return '';
        }
        if (!this.fileParseError) {
          if (output !== undefined && output !== '') {
            this.questions =
              output.map(element => {
                const question: Question = new Question();
                question.questionText = element['Question'];
                question.answers = [
                  { 'id': 1, 'answerText': element['Option 1'], correct: false },
                  { 'id': 2, 'answerText': element['Option 2'], correct: false },
                  { 'id': 3, 'answerText': element['Option 3'], correct: false },
                  { 'id': 4, 'answerText': element['Option 4'], correct: false }
                ];

                if (question.answers[element['Answer Index'] - 1] !== undefined) {
                  question.answers[element['Answer Index'] - 1].correct = true;
                }

                for (let i = 1; i < 10; i++) {
                  if (element['Tag ' + i] && element['Tag ' + i] !== '') {
                    if (this.isTagExist(element['Tag ' + i], question) === -1) {
                      question.tags.push(element['Tag ' + i].trim());
                    }
                  }
                }

                question.published = false;
                question.explanation = 'status - not approved';
                question.status = QuestionStatus.PENDING;
                question.created_uid = this.user.userId;

                if (!question.questionText || question.questionText.trim() === '') {
                  this.questionValidationError = true;
                  question.validationErrorMessages.push('Missing Question');
                } else if (question.answers[0].answerText.trim() === '' || question.answers[1].answerText.trim() === '' ||
                  question.answers[2].answerText.trim() === '' || question.answers[3].answerText.trim() === '') {
                  this.questionValidationError = true;
                  question.validationErrorMessages.push('Missing Question Answer Options');
                } else if (question.answers.filter(a => a.correct).length !== 1) {
                  this.questionValidationError = true;
                  question.validationErrorMessages.push('Must have exactly one correct answer');
                } else if (question.answers.filter(a => !a.answerText || a.answerText.trim() === '').length > 0) {
                  this.questionValidationError = true;
                  question.validationErrorMessages.push('Missing Answer');
                } else if (question.questionText.length > this.applicationSettings.question_max_length) {
                  this.questionValidationError = true;
                  question.validationErrorMessages.push(`${this.applicationSettings.question_max_length}
                   characters are allowed for Question Text`);
                } else if (question.answers.some(
                  (answer) => answer.answerText.trim().length > this.applicationSettings.answer_max_length)) {
                  this.questionValidationError = true;
                  question.validationErrorMessages.push(`${this.applicationSettings.answer_max_length}
                   characters are allowed for Answer Text`);
                } else if (question.tags.length < 3) {
                  this.questionValidationError = true;
                  question.validationErrorMessages.push('Atleast 3 tags required');
                }

                return question;
              });
            this.bulkUploadFileInfo.uploaded = this.questions.length;
          }
        }


      },
      header: true,
      skipEmptyLines: true,
      error: (error) => {
        if (error) {
          this.fileParseError = true;
          this.fileParseErrorMessage = `File Parsing ${error}`;
        }
      }
    });
  }

  isTagExist(tag, question) {
    const index = question.tags.findIndex(x => x.toLowerCase().trim() === tag.toLowerCase().trim());
    return index;

  }

  private prepareUpload(): any {
    const input = new FormData();
    input.append('category', this.uploadFormGroup.get('category').value);
    input.append('tag', this.uploadFormGroup.get('tagControl').value);
    input.append('csvFile', this.uploadFormGroup.get('csvFile').value);
    return input;
  }

  onUploadSubmit() {
    // validate
    if (!this.uploadFormGroup.valid) {
      if (this.bulkUploadFileInfo === undefined) {
        this.fileParseError = true;
        this.fileParseErrorMessage = 'Please upload .CSV file';
      }
      return;

    } else {
      const formModel = this.prepareUpload();
      const dbQuestions: Array<Question> = [];
      // add primary tag to question tag list
      this.primaryTag = this.uploadFormGroup.get('tagControl').value;
      for (const question of this.questions) {
        this.bulkUploadFileInfo.categoryId = this.uploadFormGroup.get('category').value;
        this.bulkUploadFileInfo.primaryTag = this.uploadFormGroup.get('tagControl').value;
        question.categoryIds = [this.uploadFormGroup.get('category').value];
        if (this.primaryTag.trim() !== '') {
          const duplicateTagIndex = this.isTagExist(this.primaryTag, question);
          if (duplicateTagIndex !== -1) {
            question.tags.splice(duplicateTagIndex, 1);
          }
          question.tags = [this.primaryTag, ...question.tags.filter(tag => tag !== this.primaryTagOld)];
        } else if (this.primaryTag === '') {
          question.tags = [...question.tags.filter(tag => tag !== this.primaryTagOld)];
        }

        question.createdOn = new Date();
        dbQuestions.push(question);
      }
      if (this.primaryTag !== this.primaryTagOld) {
        this.primaryTagOld = this.primaryTag;
      }
      this.bulkUploadFileInfo.created_uid = this.user.userId;
      this.bulkUploadFileInfo.date = new Date().getTime();
      this.parsedQuestions = dbQuestions;
    }
  }

  onReviewSubmit(): void {
    const bulkUpload = new BulkUpload();
    bulkUpload.bulkUploadFileInfo = this.bulkUploadFileInfo;
    bulkUpload.questions = this.parsedQuestions;
    bulkUpload.file = this.file;
    bulkUpload.bulkUploadFileInfo['isAdminArchived'] = false;
    bulkUpload.bulkUploadFileInfo['isUserArchived'] = false;
    this.store.dispatch(new bulkActions.AddBulkQuestions({ bulkUpload: bulkUpload }));
  }

  ngOnDestroy() {

  }

  showUploadSteps() {
    if (this.showInstructions) {
      this.showInstructions = false;
    } else {
      this.showInstructions = true;
    }
  }
}
