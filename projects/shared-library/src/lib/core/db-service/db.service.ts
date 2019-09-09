import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable()
export abstract class DbService {

    constructor() {

    }

    public createDoc(collectionName: string, document: any): any {
    }

    public CreateDocWithoutDocID(collectionName: string, document: any): any {
    }

    public setDoc(collectionName: string, docId: any, document: any, timeStamp?: {createdOn?: boolean, updatedOn?: boolean}): any {

    }

    public updateDoc(collectionName: string, docId: any, document: any) {

    }
    public valueChanges(collectionName: string, path?: any, queryParams?: any): Observable<any> {
        return of();
    }

    public createId(): any {

    }
    public getFireStorageReference(filePath: string): any {

    }

    public getFireStore(): any {

    }

    public getDoc(collectionName: string, docId: any): any {

    }

    public upload(filePath: string, imageBlob: any): any {

    }

    public deleteDoc(collectionName: string, docId: any): any {

    }

}
