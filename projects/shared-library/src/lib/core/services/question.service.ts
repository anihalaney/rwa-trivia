import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireStorage } from 'angularfire2/storage';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { CONFIG } from '../../environments/environment';
import {
  Question, QuestionStatus, SearchResults, SearchCriteria,
  BulkUploadFileInfo, BulkUpload
} from '../../shared/model';
import { Store } from '@ngrx/store';
import { CoreState } from '../store';
import { QuestionActions } from '../store/actions';

@Injectable()
export class QuestionService {

  constructor(private db: AngularFirestore,
    private storage: AngularFireStorage,
    private store: Store<CoreState>,
    private questionActions: QuestionActions,
    private http: HttpClient) {
  }

  // Elasticsearch
  getQuestionOfTheDay(isNextQuestion: boolean): Observable<Question> {
    let url: string = CONFIG.functionsUrl + '/app/question/day';
    url = (isNextQuestion) ? `${url}/next` : `${url}/current`
    return this.http.get<Question>(url);
  }

  getQuestions(startRow: number, pageSize: number, criteria: SearchCriteria): Observable<SearchResults> {
    const url: string = CONFIG.functionsUrl + '/app/question/';

    return this.http.post<SearchResults>(url + startRow + '/' + pageSize, criteria);
  }

  // Firestore
  getUserQuestions(userId: string, published: boolean): Observable<Question[]> {
    const collection = (published) ? 'questions' : 'unpublished_questions';
    return this.db.collection(`/${collection}`, ref => ref.where('created_uid', '==', userId))
      .valueChanges()
      .pipe(
        map(qs => qs.map(q => Question.getViewModelFromDb(q))),
        catchError(error => {
          console.log(error);
          return of(null);
        }));
  }

  // get Questions by bulk upload id
  getQuestionsForBulkUpload(bulkUploadFileInfo: BulkUploadFileInfo, published: boolean): Observable<Question[]> {
    const collection = (published) ? 'questions' : 'unpublished_questions';
    return this.db.collection(`/${collection}`, ref => {
      return ref.where('created_uid', '==', bulkUploadFileInfo.created_uid)
        .where('bulkUploadId', '==', bulkUploadFileInfo.id)
    })
      .valueChanges()
      .pipe(
        map(qs => qs.map(q => Question.getViewModelFromDb(q))),
        catchError(error => {
          console.log(error);
          return of(null);
        }));
  }

  getUnpublishedQuestions(flag: boolean): Observable<Question[]> {
    const question_source = (!flag) ? 'question' : 'bulk-question';
    return this.db.collection('/unpublished_questions', ref => ref.where('source', '==', question_source)).valueChanges()
      .pipe(catchError(error => {
        console.log(error);
        return of(null);
      }));
  }

  saveQuestion(question: Question) {
    const dbQuestion = Object.assign({}, question); // object to be saved
    const questionId = this.db.createId();
    if (dbQuestion.id === undefined || dbQuestion.id === '') {
      dbQuestion.id = questionId;
      dbQuestion['source'] = 'question';
    }
    this.db.doc('/unpublished_questions/' + dbQuestion.id).set(dbQuestion).then(ref => {
      if (questionId === dbQuestion.id) {
        this.store.dispatch(this.questionActions.addQuestionSuccess());
      }
    });
  }

  saveBulkQuestions(bulkUpload: BulkUpload) {
    const dbQuestions: Array<any> = [];
    const bulkUploadFileInfo = bulkUpload.bulkUploadFileInfo;
    const questions = bulkUpload.questions;

    const bulkUploadId = this.db.createId();
    // store file in file storage
    // Not written any code monitor progress or error
    this.storage.upload(`bulk_upload/${bulkUploadFileInfo.created_uid}/${bulkUploadId}-${bulkUpload.file.name}`, bulkUpload.file)
      .then(ref => {
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
      });

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
    question['source'] = 'bulk-question';
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
      )
    })

  }


}
