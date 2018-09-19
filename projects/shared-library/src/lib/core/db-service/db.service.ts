import { Injectable, Inject, NgZone } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from '../../shared/model';

@Injectable()
export class DbService {

    constructor() {

    }


    public getUser(user: User): Observable<User> {
        // Must Implement in child 
        return of();
    }

    public saveUser(user: User) {

    }

    public setCollection(name, id, collection) {

    }

    public updateCollection(name, id, collection) {

    }
    public listenForChanges(name: string, path?: any, queryParams?: Array<{ name: string; comparator: string; value: any }>): Observable<any> {
        return of();
    }
    
    public createId(){
         
    }
}