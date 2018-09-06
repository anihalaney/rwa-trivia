import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { take, map, catchError } from 'rxjs/operators';

@Injectable()
export class TagService {

  constructor() {
  }

  getTags(): Observable<string[]> {
    //console.log(firebase.app().options);
    // return this.db.doc<{"tagList": string[]}>('/lists/tags').valueChanges().pipe(take(1), map(t => t.tagList), catchError(() => []));
    return of();
  }
}
