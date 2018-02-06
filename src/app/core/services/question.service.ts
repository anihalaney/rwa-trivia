import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireStorage } from 'angularfire2/storage';
import { Observable } from 'rxjs/Observable';
import '../../rxjs-extensions';

import { CONFIG } from '../../../environments/environment';
import { User, Question, QuestionStatus, SearchResults, SearchCriteria, BulkUploadFileInfo, BulkUpload } from '../../model';
import { Store } from '@ngrx/store';
import { AppStore } from '../store/app-store';
import { QuestionActions } from '../store/actions';

@Injectable()
export class QuestionService {
  constructor(private db: AngularFirestore,
    private storage: AngularFireStorage,
    private store: Store<AppStore>,
    private questionActions: QuestionActions,
    private http: HttpClient) {
  }

  // Elasticsearch
  getQuestionOfTheDay(): Observable<Question> {
    const url: string = CONFIG.functionsUrl + '/app/getQuestionOfTheDay';

    return this.http.get<Question>(url);
  }

  getQuestions(startRow: number, pageSize: number, criteria: SearchCriteria): Observable<SearchResults> {
    const url: string = CONFIG.functionsUrl + '/app/getQuestions/';
    // let url: string = "https://us-central1-rwa-trivia.cloudfunctions.net/app/getQuestions/";

    return this.http.post<SearchResults>(url + startRow + '/' + pageSize, criteria);
  }

  // Firestore
  getUserQuestions(user: User, published: boolean): Observable<Question[]> {
    const collection = (published) ? 'questions' : 'unpublished_questions';
    return this.db.collection(`/${collection}`, ref => ref.where('created_uid', '==', user.userId))
      .valueChanges()
      .map(qs => qs.map(q => Question.getViewModelFromDb(q)));
  }

  // get Questions by fileId
  getFileQuestions(bulkUploadFileInfo: BulkUploadFileInfo, published: boolean): Observable<Question[]> {

    let id = "";
    let d = (bulkUploadFileInfo.id) ? bulkUploadFileInfo.id: id;
    const collection = (published) ? 'questions' : 'unpublished_questions';
    return this.db.collection(`/${collection}`, ref => ref.where('bulkUploadId', '==', d))
      .valueChanges()
      .map(qs => qs.map(q => Question.getViewModelFromDb(q)));
  }

  getUnpublishedQuestions(): Observable<Question[]> {
    return this.db.collection('/unpublished_questions').valueChanges()
      .catch(error => {
        console.log(error);
        return Observable.of(null);
      });
  }

  saveQuestion(question: Question) {
    const dbQuestion = Object.assign({}, question); // object to be saved

    const questionId = this.db.createId();
    dbQuestion.id = questionId;
    // console.log('dbQuestion--->', JSON.stringify(dbQuestion));
    // Use the set method of the doc instead of the add method on the collection, so the id field of the data matches the id of the document
    this.db.doc('/unpublished_questions/' + questionId).set(dbQuestion).then(ref => {
      this.store.dispatch(this.questionActions.addQuestionSuccess());
    });
  }

  saveBulkQuestions(bulkUpload: BulkUpload) {
    const dbQuestions: Array<any> = [];

    const bulkUploadFileInfo = bulkUpload.bulkUploadFileInfo;
    const questions = bulkUpload.questions;

    const bulkUploadId = this.db.createId();
    // store file in file storage
    // Not written any code monitor progress or error
    this.storage.upload(`bulk_upload/${bulkUploadFileInfo.created_uid}/${bulkUploadId}-${bulkUpload.file.name}`, bulkUpload.file);
    for (const question of questions) {
      if (question !== null) {
        question.bulkUploadId = bulkUploadId;
        const dbQuestion = Object.assign({}, question); // object to be saved
        dbQuestion.id = this.db.createId();
        // Do we really need to copy answer object as well?
        dbQuestion.answers = dbQuestion.answers.map((obj) => { return Object.assign({}, obj) });
        dbQuestions.push(dbQuestion);
      }
    }
    this.addBulkUpload(bulkUploadFileInfo, dbQuestions, bulkUploadId);
  }
  addBulkUpload(bulkUploadFileInfo: BulkUploadFileInfo, questions: Array<Question>, id: string) {
    // save question
    const dbFile = Object.assign({}, bulkUploadFileInfo);
    dbFile.id = id;
    dbFile.rejected = 0;
    dbFile.approved = 0;
    dbFile.status = 'Under Review';
    this.db.doc('/bulk_uploads/' + dbFile['id']).set(dbFile).then(ref => {
      this.storeQuestion(0, questions);
    });
  }

  storeQuestion(index: number, questions: Array<Question>): void {
    const question = questions[index];
    console.log('question--->', JSON.stringify(question));
    this.db.doc(`/unpublished_questions/${question.id}`)
      .set(question)
      .then(ref => {
        if (index === questions.length - 1) {
          this.store.dispatch(this.questionActions.addQuestionSuccess());
        } else {
          index++;
          this.storeQuestion(index, questions);
        }
      });
  }

  approveQuestion(question: Question) {
    const dbQuestion = Object.assign({}, question); // object to be saved

    const questionId = dbQuestion.id;
    dbQuestion.status = QuestionStatus.APPROVED;

    // Transaction to remove from unpublished and add to published questions collection
    this.db.firestore.runTransaction(transaction => {
      return transaction.get(this.db.doc('/unpublished_questions/' + questionId).ref).then(doc =>
        transaction.set(this.db.doc('/questions/' + questionId).ref, dbQuestion).delete(doc.ref)
      );
    });
  }


  
}
