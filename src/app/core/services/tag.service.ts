import { Injectable }    from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
//import * as firebase from 'firebase';
import { Observable } from 'rxjs/Observable';
import '../../rxjs-extensions';

@Injectable()
export class TagService {

  constructor(private db: AngularFireDatabase) { 
  }

  getTags(): Observable<string[]> {
    //console.log(firebase.app().options);
    return this.db.list('/tagList').snapshotChanges().map(t => t.map(a => a.payload.val()));
  }
}
