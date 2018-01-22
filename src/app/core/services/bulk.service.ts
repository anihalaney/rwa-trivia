import { Injectable }    from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireStorage } from 'angularfire2/storage';
//AngularFireStorageModule
import { Observable } from 'rxjs/Observable';
import '../../rxjs-extensions';

import { HttpClient, HttpHeaders }    from '@angular/common/http';
import { Category } from '../../model/category';

@Injectable()
export class BulkService {

  constructor(private db: AngularFirestore,
              private storage: AngularFireStorage,
              private http: HttpClient) { 
  }

  uploadQuestionsFile(data: any): Observable<any> {
    this.storage.storage.ref();
    const task = this.storage.upload("path", data); //, metadata);
    
    // observe percentage changes
    //return task.percentageChanges();
    // get notified when the download URL is available
    return task.downloadURL();
  }
  
}
