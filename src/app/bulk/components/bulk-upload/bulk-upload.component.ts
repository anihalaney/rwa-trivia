import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';
import { QuestionActions } from '../../../core/store/actions';
import { AppStore } from '../../../core/store/app-store';
import { Utils } from '../../../core/services';
import { Category, User, Question, QuestionStatus, BulkUploadFileInfo, SearchResults } from '../../../model';

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

  //Properties
  categories: Category[];
  subs: Subscription[] = [];

  tags: string[];
  filteredTags$: Observable<string[]>;

  //Question List
  questions: Array<Question> = [];
  //user Object
  user: User;
  // bulk upload object
  _SearchResults: SearchResults;


  constructor(private fb: FormBuilder,
    private store: Store<AppStore>,
    private questionActions: QuestionActions) {
    this.categoriesObs = store.select(s => s.categories);
    this.tagsObs = store.select(s => s.tags);
    this._SearchResults = new SearchResults();
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
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      this.uploadFormGroup.get('csvFile').setValue(file);
      reader.readAsText(file);
      reader.onload = () => {
        console.log(file);
        // this._bulkUploadFileInfo.file = file.name;
        // this._bulkUploadFileInfo.uploadedOn = file.lastModifiedDate;

        // console.log(reader.result);

        // generate Question Objects
        this.generateQuestions(reader.result);
      };
    }
  }

  generateQuestions(csvString: string): void {
    const lines = csvString.split(/\r\n|\n/);
    this.store.take(1).subscribe(s => this.user = s.user);
    for (let l_no = 1; l_no < lines.length - 1; l_no++) {
      const csvData: Array<string> = lines[l_no].split(',');
      const question: Question = new Question();
      question.questionText = csvData[0];
      question.answers[0].answerText = csvData[1];
      question.answers[0].correct = (Number(csvData[5]) === 1) ? true : null;
      question.answers[1].answerText = csvData[2];
      question.answers[1].correct = (Number(csvData[5]) === 2) ? true : null;
      question.answers[2].answerText = csvData[3];
      question.answers[2].correct = (Number(csvData[5]) === 3) ? true : null;
      question.answers[3].answerText = csvData[4];
      question.answers[3].correct = (Number(csvData[5]) === 4) ? true : null;
      for (let i = 6; i < csvData.length; i++) {
        const tag = csvData[i];
        if (tag !== '' && question.tags.indexOf(tag)) {
          question.tags.push(csvData[i]);
        }
      }
      question.status = QuestionStatus.SUBMITTED;


      question.created_uid = this.user.userId;
      question.explanation = null;
      if (this.questions.indexOf(question)) {
        this.questions.push(question);
      }
    }
    // this._bulkUploadFileInfo.status = 'SUBMITTED';
    // this._bulkUploadFileInfo.uploaded = this.questions.length;
    // this._bulkUploadFileInfo.approved = 0;
    // this._bulkUploadFileInfo.rejected = 0;

    console.log('questions--->', JSON.stringify(this.questions));
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
      return;

    }
    const formModel = this.prepareUpload();

    const dbQuestions: Array<Question> = [];

    for (const question of this.questions) {
      question.categoryIds = [this.uploadFormGroup.get('category').value];
      dbQuestions.push(question);
    }
    //dispatch action
    console.log('dbQuestions--->', JSON.stringify(dbQuestions));
    // this._bulkUploadFileInfo.rejected = 0;
    // this._bulkUploadFileInfo.categoryId = this.uploadFormGroup.get('category').value;
    // this._bulkUploadFileInfo.primaryTag = this.uploadFormGroup.get('tagControl').value;
    // this._bulkUploadFileInfoList.push(this._bulkUploadFileInfo);
    this.store.dispatch(this.questionActions.addBulkQuestions(dbQuestions));
    this._SearchResults.questions = dbQuestions;
  }

  ngOnDestroy() {
    Utils.unsubscribe(this.subs);
  }
}
