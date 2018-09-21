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

    public setCollection(name, id, collection): any {

    }

    public updateCollection(name, id, collection) {

    }
    public listenForChanges(name: string, path?: any, queryParams?: any): Observable<any> {
        return of();
    }

    public createId(): any {

    }
    public getFireStoreReference(filePath): any {

    }

    public getFireStore(): any {

    }

    public getCollection(collectionName, docId): any {

    }

    public upload(filePath, imageBlob): any {

    }

    public fireStore(): any {

    }
}