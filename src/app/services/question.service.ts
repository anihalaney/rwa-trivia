import { Injectable }    from '@angular/core';
import { Headers, Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import '../rxjs-extensions';

import { Question }     from '../model';

@Injectable()
export class QuestionService {
  private _serviceUrl = 'http://localhost:3000/questions';  // URL to web api

  constructor(private http: Http) { 
  }

  getQuestions(): Observable<Question[]> {
      let url = this._serviceUrl;
      return this.http.get(url)
               .map(res => res.json() );
  }

  saveQuestion(question: Question): Observable<Question> {
      let url = this._serviceUrl;

      return this.http.post(url, question)
                 .map(res => res.json());
  }

}
