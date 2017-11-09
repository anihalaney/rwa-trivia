import { Injectable }    from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import '../../rxjs-extensions';

import { Category } from '../../model/category';

@Injectable()
export class CategoryService {

  constructor(private db: AngularFirestore) { 
  }

  getCategories(): Observable<Category[]> {
    return this.db.collection<Category>('/categories').valueChanges().take(1);
  }
  
}
