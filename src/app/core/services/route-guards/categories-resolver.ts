import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
  
import { AppStore } from '../../store/app-store';
import { Category } from '../../../model';
  
@Injectable()
export class CategoriesResolver implements Resolve<Category[]> {
  constructor(private store: Store<AppStore>, private router: Router) {}
 
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Category[]> {
    //console.log("resolve");
    return this.store.select(s => s.categories).filter(c => c.length > 0).take(1);
  }
}