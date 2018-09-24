import { Injectable, Inject, NgZone } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable()
export abstract class DbService {

    constructor() {

    }

    public setCollection(name, id, collection): any {

    }

    public updateCollection(name, id, collection) {

    }
    public valueChanges(name: string, path?: any, queryParams?: any): Observable<any> {
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

}