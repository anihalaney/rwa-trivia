import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { take } from 'rxjs/operators';
import { Category } from '../../shared/model';


@Injectable()
export class CategoryService {

  constructor() {
  }

  getCategories(): Observable<Category[]> {
    // return this.db.collection<Category>('/categories').valueChanges().pipe(take(1));
    return of();
  }

}
