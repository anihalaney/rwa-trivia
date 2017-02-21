import { Injectable }    from '@angular/core';
import { Headers, Http } from '@angular/http';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { Observable } from 'rxjs/Observable';
import '../rxjs-extensions';

import { Category } from '../model/category';

@Injectable()
export class CategoryService {

  constructor(private af: AngularFire) { 
  }

  getCategories(): Observable<Category[]> {
    return this.af.database.list('/categories');
  }
  
}
