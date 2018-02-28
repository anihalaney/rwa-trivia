import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';
import { QuestionActions, BulkUploadActions } from '../../../core/store/actions';
import { AppState, appState } from '../../../store';
import { Utils } from '../../../core/services';
import { Category, User, Question, QuestionStatus, BulkUploadFileInfo } from '../../../model';
import { parse } from 'csv';

@Component({
  selector: 'bulk-upload',
  templateUrl: './bulk-upload.component.html',
  styleUrls: ['./bulk-upload.component.scss']
})
export class BulkUploadComponent implements OnInit, OnDestroy {

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
  subs: Subscription[] = [];

  tags: string[];
  filteredTags$: Observable<string[]>;

  // Question List
  questions: Array<Question> = [];
  // user Object
  user: User;
  // bulk upload object
  parsedQuestions: Array<Question> = [];

  constructor(private fb: FormBuilder,
    private store: Store<AppState>,
    private bulkUploadActions: BulkUploadActions,
    private questionActions: QuestionActions) {
    this.categoriesObs = store.select(appState.coreState).select(s => s.categories);
    this.tagsObs = store.select(appState.coreState).select(s => s.tags);
    this.store.select(appState.coreState).take(1).subscribe(s => this.user = s.user);
  }

  ngOnInit() {
    this.subs.push(this.categoriesObs.subscribe(categories => this.categories = categories));
    this.subs.push(this.tagsObs.subscribe(tags => this.tags = tags));
    
    this.uploadFormGroup = this.fb.group({
      category: ['', Validators.required],
      tagControl: [''],
      csvFile: null
    });

    this.filteredTags$ = this.uploadFormGroup.get('tagControl').valueChanges
      .map(val => val.length > 0 ? this.filter(val) : []);
  }

  filter(val: string): string[] {
    return this.tags.filter(option => new RegExp(Utils.regExpEscape(`${val}`), 'gi').test(option));
  }

  onFileChange(event) {
    const reader = new FileReader();
    this.fileParseError = false;
    if (event.target.files && event.target.files.length > 0) {
      const file = this.file = event.target.files[0];
      this.uploadFormGroup.get('csvFile').setValue(file);
      reader.readAsText(file);
      reader.onload = () => {
        this.bulkUploadFileInfo = new BulkUploadFileInfo;
        this.bulkUploadFileInfo.fileName = file['name'];
        this.generateQuestions(reader.result);
      };
    }

  }

  generateQuestions(csvString: string): void {
    this.questionValidationError = false;
    this.fileParseError = false;
    this.fileParseErrorMessage = '';

    const parseOptions = {
      'columns': columns => {
        const validColumns = ['Question', 'Option 1', 'Option 2', 'Option 3', 'Option 4', 'Answer Index', 'Tag 1', 'Tag 2', 'Tag 3',
          'Tag 4', 'Tag 5', 'Tag 6', 'Tag 7', 'Tag 8', 'Tag 9'];
        if (validColumns.join(',') === columns.join(',')) {
          return columns;
        } else {
          this.fileParseError = true;
          this.fileParseErrorMessage = 'File format is not correct, must be in CSV format, must not have missing or wrong column order';
          return '';
        }
      },
      'skip_empty_lines': true
    };

    parse(csvString, parseOptions,
      (err, output) => {
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
              ]

              if (question.answers[element['Answer Index'] - 1] !== undefined) {
                question.answers[element['Answer Index'] - 1].correct = true;
              }

              // add primary tag to question tag list
              question.tags = [this.uploadFormGroup.get('tagControl').value];

              for (let i = 1; i < 10; i++) {
                if (element['Tag ' + i] && element['Tag ' + i] !== '') {
                  // check for duplicate tags
                  if (question.tags.indexOf(element['Tag ' + i].trim()) === -1) {
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
              } else if (question.tags.length < 3) {
                this.questionValidationError = true;
                question.validationErrorMessages.push('Atleast 3 tags required');
              }

              return question;
            });
          this.bulkUploadFileInfo.uploaded = this.questions.length;
        }
      });
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
    if (!this.uploadFormGroup.valid || this.bulkUploadFileInfo === undefined) {
      return;

    } else {
      const formModel = this.prepareUpload();

      const dbQuestions: Array<Question> = [];

      for (const question of this.questions) {
        this.bulkUploadFileInfo.categoryId = this.uploadFormGroup.get('category').value;
        this.bulkUploadFileInfo.primaryTag = this.uploadFormGroup.get('tagControl').value;
        question.categoryIds = [this.uploadFormGroup.get('category').value];
        question.createdOn = new Date();
        dbQuestions.push(question);
      }
      this.bulkUploadFileInfo.created_uid = this.user.userId;
      this.bulkUploadFileInfo.date = new Date().getTime();
      this.parsedQuestions = dbQuestions;
    }
  }

  onReviewSubmit(): void {
    this.store.dispatch(this.questionActions
      .addBulkQuestions({
        bulkUploadFileInfo: this.bulkUploadFileInfo,
        questions: this.parsedQuestions, file: this.file
      }));
  }

  ngOnDestroy() {
    Utils.unsubscribe(this.subs);
  }
}
