import { Injectable }    from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { Observable } from 'rxjs/Observable';
import '../rxjs-extensions';

import { Question }     from '../model';
import { Store } from '@ngrx/store';
import { AppStore } from '../store/app-store';
import { QuestionActions } from '../store/actions';

@Injectable()
export class QuestionService {
  private _serviceUrl = 'http://localhost:3000/questions';  // URL to web api

  constructor(private af: AngularFire,
              private store: Store<AppStore>,
              private questionActions: QuestionActions) { 
  }

  getQuestions(): Observable<Question[]> {
    return this.af.database.list('/questions/published');
  }

  saveQuestion(question: Question) {
    this.af.database.list('/questions/unpublished').push(question).then(
      (ret) => {  //success
        if (ret.key)
          this.af.database.object('/users/' + question.created_uid + '/questions').set({[ret.key]: "unpublished"});
        this.store.dispatch(this.questionActions.addQuestionSuccess());
      },
      (error: Error) => {//error
        console.error(error);
      }
    );
  }

}
