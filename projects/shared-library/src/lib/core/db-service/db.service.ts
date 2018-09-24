import { Injectable, Inject, NgZone } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable()
export abstract class DbService {

    constructor() {

    }

    public setDoc(collectionName, docId, document): any {

    }

    public updateDoc(collectionName, docId, document) {

    }
    public valueChanges(collectionName: string, path?: any, queryParams?: any): Observable<any> {
        return of();
    }

    public createId(): any {

    }
    public getFireStorageReference(filePath): any {

    }

    public getFireStore(): any {

    }

    public getDoc(collectionName, docId): any {

    }

    public upload(filePath, imageBlob): any {

    }

}