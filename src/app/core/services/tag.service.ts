import { Injectable }    from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import '../../rxjs-extensions';

@Injectable()
export class TagService {

  constructor(private db: AngularFirestore) { 
  }

  getTags(): Observable<string[]> {
    //console.log(firebase.app().options);
    return this.db.doc<{"tagList": string[]}>('/lists/tags').valueChanges().take(1).map(t => t.tagList);
  }
}
