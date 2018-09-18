import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, take, filter } from 'rxjs/operators';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { CoreState, coreState } from '../store';
import { Category } from '../../shared/model';

@Injectable()
export class CategoriesResolver implements Resolve<Category[]> {
  constructor(private store: Store<CoreState>, private router: Router) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Category[]> {
    return this.store.select(coreState).pipe(
      map(s => s.categories),
      filter(c => c.length > 0),
      take(1));
  }
}