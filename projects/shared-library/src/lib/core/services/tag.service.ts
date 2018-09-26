import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { take, map, catchError } from 'rxjs/operators';
import { DbService } from "./../db-service"

@Injectable()
export class TagService {

  constructor(private dbService: DbService) {
  }

  getTags(): Observable<string[]> {
    return this.dbService.valueChanges('lists', 'tags').pipe(take(1), map(t => t.tagList), catchError(() => []))
  }
  
}
