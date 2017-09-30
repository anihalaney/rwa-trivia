import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
  
import { AppStore } from '../../store/app-store';
  
@Injectable()
export class TagsResolver implements Resolve<string[]> {
  constructor(private store: Store<AppStore>, private router: Router) {}
 
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<string[]> {
    return this.store.select(s => s.tags).filter(t => t.length > 0).take(1);
  }
}
