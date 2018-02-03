import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import '../../rxjs-extensions';

import { CONFIG } from '../../../environments/environment';
import { User, Question, QuestionStatus, SearchResults, SearchCriteria, FileTrack } from '../../model';
import { Store } from '@ngrx/store';
import { AppStore } from '../store/app-store';
import { FileSummaryActions } from '../store/actions';

@Injectable()
export class FileSummaryService {
  constructor(private db: AngularFirestore,
    private store: Store<AppStore>,
    private fileSummaryActions: FileSummaryActions,
    private http: HttpClient) {
  }

  

  // addFileRecord(filetrack: FileTrack) {
  //   console.log("sd");
  //   // save question
  //   // console.log('index--->', index);
  //   // console.log('question--->', JSON.stringify(question));
  //   const dbFile = Object.assign({}, filetrack);
  //   dbFile.id = this.db.createId();
  //   dbFile.rejected=0;
  //   dbFile.approved = 0;
  //   // dbFile.status
    

  //   this.db.doc('/file_track_records/' + dbFile.id).set(dbFile).then(ref => {
  //    // console.log(' questions.length --->',  questions.length );
  //     console.log(dbFile);
  //   });
  // }

  loadFileRecord(): Observable<FileTrack[]> {
    return this.db.collection('/file_track_records').valueChanges()
      .catch(error => {
        console.log(error);
        return Observable.of(null);
      });
  }

}
