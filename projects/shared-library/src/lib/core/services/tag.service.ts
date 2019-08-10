import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map, take } from 'rxjs/operators';
import { DbService } from './../db-service';
import { RoutesConstants } from '../../shared/model';
import { CONFIG } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class TagService {
  private RC = RoutesConstants;
  constructor(
    private dbService: DbService,
    private http: HttpClient) {
  }

  getTags(): Observable<string[]> {
    return this.dbService.valueChanges('lists', 'tags').pipe(take(1), map(t => t.tagList), catchError(() => []));
  }

  getTopTags() {
    const url = `${CONFIG.functionsUrl}/${this.RC.GENERAL}/${this.RC.TOP_TAGS_COUNT}`;
    return this.http.get<any>(url);
  }
}
