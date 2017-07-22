import { Injectable }    from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import '../../rxjs-extensions';

import { Category } from '../../model/category';

@Injectable()
export class CategoryService {

  constructor(private db: AngularFireDatabase) { 
  }

  getCategories(): Observable<Category[]> {
    return this.db.list('/categories');
  }
  
}
