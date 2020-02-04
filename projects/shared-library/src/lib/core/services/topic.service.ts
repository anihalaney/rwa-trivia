import { Injectable } from '@angular/core';
import { Observable, combineLatest, forkJoin } from 'rxjs';
import { take, map, catchError, concatMap } from 'rxjs/operators';
import { Topic, RoutesConstants } from '../../shared/model';
import { DbService } from './../db-service';
import { CONFIG } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class TopicService {

  private RC = RoutesConstants;

  constructor(
    private dbService: DbService,
    private http: HttpClient
  ) {
  }

  getTopics(): Observable<Topic[]> {

    const catUrl = `${CONFIG.functionsUrl}/${this.RC.GENERAL}/${this.RC.TOP_CATEGORIES_COUNT}`;
    const tagUrl = `${CONFIG.functionsUrl}/${this.RC.GENERAL}/${this.RC.TOP_TAGS_COUNT}`;
    
    return forkJoin(
      this.http.get<any>(catUrl),
      this.http.get<any>(tagUrl))
      .pipe(map(data => {
        let topics = [];
        data[0].map(category => { category.type = 'category'; category.id = category.key;  topics.push(category); } );
        data[1].map(tag => { tag.id = tag.key; tag.type = 'tag'; topics.push(tag);} );
        return topics.sort((prev, next) => next.doc_count - prev.doc_count);
      }));
  }

  getTopTopics() {

    const catUrl = `${CONFIG.functionsUrl}/${this.RC.GENERAL}/${this.RC.TOP_CATEGORIES_COUNT}`;
    const tagUrl = `${CONFIG.functionsUrl}/${this.RC.GENERAL}/${this.RC.TOP_TAGS_COUNT}`;
    
    return forkJoin(
      this.http.get<any>(catUrl),
      this.http.get<any>(tagUrl))
      .pipe(map(data => {
        let topics = [];
        data[0].map(category => { category.type = 'category'; category.id = category.key;  topics.push(category); });
        data[1].map(tag => { tag.id = tag.key; tag.type = 'tag'; topics.push(tag);} );
        return topics.sort((prev, next) => next.doc_count - prev.doc_count);
      }));
  }
}
