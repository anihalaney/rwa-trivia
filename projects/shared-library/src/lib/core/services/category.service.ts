import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { Category } from '../../shared/model';

@Injectable()
export class CategoryService {

  constructor(private db: AngularFirestore) {
  }

  getCategories(): Observable<Category[]> {
    return this.db.collection<Category>('/categories').valueChanges().pipe(take(1));
  }

}
