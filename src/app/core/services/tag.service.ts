import { Injectable }    from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { take, map, catchError } from 'rxjs/operators';

@Injectable()
export class TagService {

  constructor(private db: AngularFirestore) {
  }

  getTags(): Observable<string[]> {
    //console.log(firebase.app().options);
    return this.db.doc<{"tagList": string[]}>('/lists/tags').valueChanges().pipe(take(1), map(t => t.tagList), catchError(() => []));
  }
}
