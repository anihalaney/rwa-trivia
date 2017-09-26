import { Injectable }    from '@angular/core';
import { HttpClient, HttpHeaders }    from '@angular/common/http';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import '../../rxjs-extensions';

import { CONFIG } from '../../../environments/environment';
import { User, Question, QuestionStatus, SearchResults, SearchCriteria }     from '../../model';
import { Store } from '@ngrx/store';
import { AppStore } from '../store/app-store';
import { QuestionActions } from '../store/actions';

@Injectable()
export class QuestionService {
  constructor(private db: AngularFireDatabase,
              private store: Store<AppStore>,
              private questionActions: QuestionActions,
              private http: HttpClient) { 
  }

  getSampleQuestions(): Observable<Question[]> {
    return this.db.list('/questions/published', {
      query: {
        limitToLast: 4,
      }
    });
  }

  getUserQuestions(user: User): Observable<Question[]> {
    return this.db.list('/users/' + user.userId + '/questions')
               .map((qids: any[]) => {
                 let questions: Question[] = [];
                 qids.forEach(qid => {
                    this.db.object('/questions/' + qid['$value'] + '/' + qid['$key']).take(1)
                    .subscribe(q => {
                      console.log(q);
                      questions.push(q)
                    });
                 });
                 return questions;
              })
              .catch(error => {
                console.log(error);
                return Observable.of(null);
              });
  }
/*
  getQuestions(): Observable<Question[]> {
    return this.db.list('/questions/published')
              .catch(error => {
                console.log(error);
                return Observable.of(null);
              });
  }
*/
  getQuestions(startRow: number, pageSize: number, criteria: SearchCriteria): Observable<SearchResults> {
    let url: string = CONFIG.functionsUrl + "/app/getQuestions/";
    //let url: string = "https://us-central1-rwa-trivia.cloudfunctions.net/app/getQuestions/";

    return this.http.post<SearchResults>(url + startRow + "/" + pageSize, criteria);
  }

  getUnpublishedQuestions(): Observable<Question[]> {
    return this.db.list('/questions/unpublished')
              .catch(error => {
                console.log(error);
                return Observable.of(null);
              });
  }

  saveQuestion(question: Question) {
    this.db.list('/questions/unpublished').push(question).then(
      (ret) => {  //success
        if (ret.key)
          this.db.object('/users/' + question.created_uid + '/questions').update({[ret.key]: "unpublished"});
        this.store.dispatch(this.questionActions.addQuestionSuccess());
      },
      (error: Error) => {//error
        console.error(error);
      }
    );
  }

  approveQuestion(question: Question) {
    let key: string = question["$key"];
    question.status = QuestionStatus.APPROVED;
    this.db.object('/questions/published').update({[key]: question}).then(
      (ret) => {  //success
        this.db.object('/users/' + question.created_uid + '/questions').update({[key]: "published"});
        this.db.object('/questions/unpublished/' + key).remove();
      },
      (error: Error) => {//error
        console.error(error);
      }
    );
  }

}
