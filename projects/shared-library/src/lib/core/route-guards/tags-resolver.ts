import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, take, filter, switchMap } from 'rxjs/operators';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { CoreState, coreState } from '../store';

@Injectable()
export class TagsResolver implements Resolve<string[]> {
  constructor(private store: Store<CoreState>, private router: Router) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<string[]> {
    return this.store.select(coreState).pipe(
      map(s => s.tags),
      filter(t => t.length > 0),
      take(1));
  }
}
