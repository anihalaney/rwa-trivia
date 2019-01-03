import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { Category } from '../../shared/model';
import { DbService } from './../db-service';

@Injectable()
export class CategoryService {

  constructor(
    private dbService: DbService) {
  }

  getCategories(): Observable<Category[]> {
    return this.dbService.valueChanges('categories').pipe(take(1));
  }
}
