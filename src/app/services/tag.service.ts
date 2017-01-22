import { Injectable }    from '@angular/core';
import { Headers, Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import '../rxjs-extensions';

@Injectable()
export class TagService {

  private _serviceUrl = 'http://localhost:3000/tagList';  // URL to web api

  constructor(private http: Http) { 
  }

  getTags(): Observable<string[]> {
    let url = this._serviceUrl;
    return this.http.get(url)
               .map(res => res.json() );
  }
}
