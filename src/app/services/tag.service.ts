import { Injectable }    from '@angular/core';
import { Headers, Http } from '@angular/http';
import { AngularFire } from 'angularfire2';
//import * as firebase from 'firebase';
import { Observable } from 'rxjs/Observable';
import '../rxjs-extensions';

@Injectable()
export class TagService {

  constructor(private af: AngularFire) { 
  }

  getTags(): Observable<string[]> {
    //console.log(firebase.app().options);
    return this.af.database.list('/tagList').map(t => t.map(a => a["$value"]));
  }
}
