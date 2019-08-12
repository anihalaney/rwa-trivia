import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { Category, RoutesConstants } from '../../shared/model';
import { DbService } from './../db-service';
import { CONFIG } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class CategoryService {

  private RC = RoutesConstants;

  constructor(
    private dbService: DbService,
    private http: HttpClient
  ) {
  }

  getCategories(): Observable<Category[]> {
    return this.dbService.valueChanges('categories').pipe(take(1));
  }

  getTopCategories() {
    const url = `${CONFIG.functionsUrl}/${this.RC.GENERAL}/${this.RC.TOP_CATEGORIES_COUNT}`;
    return this.http.get<any>(url);
  }
}
