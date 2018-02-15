import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';
import { QuestionActions, BulkUploadActions } from '../../../core/store/actions';
import { AppStore } from '../../../core/store/app-store';
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
    private store: Store<AppStore>,
    private bulkUploadActions: BulkUploadActions,
    private questionActions: QuestionActions) {
    this.categoriesObs = store.select(s => s.categories);
    this.tagsObs = store.select(s => s.tags);
    this.store.take(1).subscribe(s => this.user = s.user);
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
      // on windows with liber office type is not set to text/csv

   //   if (file.type === 'text/csv') {
        this.uploadFormGroup.get('csvFile').setValue(file);
        reader.readAsText(file);
        reader.onload = () => {
          this.bulkUploadFileInfo = new BulkUploadFileInfo;
          this.bulkUploadFileInfo.fileName = file['name'];
          this.generateQuestions(reader.result);
        };
    //   } else {
    //     this.bulkUploadFileInfo = undefined;
    //     this.parseError = true;
    //     this.parseErrorMessage = 'Please Select only .csv file';
    //   }
    }
  }

  generateQuestions(csvString: string): void {
    parse(csvString, { 'columns': true, 'skip_empty_lines': true },
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
              question.tags = [];

              for (let i = 1; i < 10; i++) {
                if (element['Tag ' + i] && element['Tag ' + i] !== '') {
                  question.tags.push(element['Tag ' + i]);
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
        } else {
          this.fileParseError = true;
          this.fileParseErrorMessage = 'File format is not correct, file must be a valid CSV format';
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
        dbQuestions.push(question);
      }
      this.bulkUploadFileInfo.created_uid = this.user.userId;
      this.bulkUploadFileInfo.date = new Date().getTime().toString();
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
