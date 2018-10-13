import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { BulkUploadFileInfo, User } from '../../shared/model';
import { DbService } from './../db-service';

@Injectable()
export class BulkService {

  constructor(
    private http: HttpClient,
    private dbService: DbService) {
  }

  // get All Bulk Upload
  getBulkUpload(user: User, archive: boolean): Observable<BulkUploadFileInfo[]> {
    if (!archive) {
      const queryParams = { condition: [{ name: "isAdminArchived", comparator: "==", value: archive }] };

      return this.dbService.valueChanges('bulk_uploads', '', queryParams)
        .pipe(catchError(error => {
          console.log(error);
          return of(null);
        }));

    } else {
      return this.dbService.valueChanges('bulk_uploads')
        .pipe(catchError(error => {
          console.log(error);
          return of(null);
        }));
    }
  }

  // get Bulk Upload by user Id
  getUserBulkUpload(user: User, archive: boolean): Observable<BulkUploadFileInfo[]> {

    const adminArchive = 'isAdminArchived';
    const userArchive = 'isUserArchived';
    let queryParams: any;

    if (!archive) {
      if (user.roles.admin && user.roles.bulkuploader) {
        queryParams = {
          condition: [{ name: "created_uid", comparator: "==", value: user.userId },
          { name: userArchive, comparator: "==", value: archive },
          { name: adminArchive, comparator: "==", value: archive }
          ]
        };
      } else if (user.roles.admin) {
        queryParams = {
          condition: [{ name: "created_uid", comparator: "==", value: user.userId },
          { name: adminArchive, comparator: "==", value: archive }
          ]
        };
      } else {
        queryParams = {
          condition: [{ name: "created_uid", comparator: "==", value: user.userId },
          { name: userArchive, comparator: "==", value: archive }
          ]
        };
      }

    } else {
      queryParams = {
        condition: [{ name: "created_uid", comparator: "==", value: user.userId }]
      };
    }

    return this.dbService.valueChanges('bulk_uploads', '', queryParams)
      .pipe(catchError(error => {
        console.log(error);
        return of(null);
      }));
  }

  // get BulkUpload by Id
  getBulkUploadById(bulkUploadFileInfo: BulkUploadFileInfo): Observable<BulkUploadFileInfo> {
    return this.dbService.valueChanges('bulk_uploads', bulkUploadFileInfo.id)
      .pipe(catchError(error => {
        console.log(error);
        return of(null);
      }));
  }

  // update Bulk Upload
  updateBulkUpload(bulkUploadFileInfo: BulkUploadFileInfo) {
    const dbBulkUploadFileInfo = Object.assign({}, bulkUploadFileInfo); // object to be saved
    // remove download URL it is observable
    delete dbBulkUploadFileInfo.downloadUrl;
    this.dbService.setDoc('bulk_uploads', dbBulkUploadFileInfo.id, dbBulkUploadFileInfo);
  }

  // get File By Bulk Upload File Name
  getFileByBulkUploadFileUrl(bulkUploadFileInfo: BulkUploadFileInfo): Observable<string> {
    const filePath = `bulk_upload/${bulkUploadFileInfo.created_uid}/${bulkUploadFileInfo.id}-${bulkUploadFileInfo.fileName}`;
    const ref = this.dbService.getFireStorageReference(filePath);
    return ref.getDownloadURL().pipe(map(url => url));
  }

  archiveBulkUpload(archiveArray: BulkUploadFileInfo[], user: User) {
    const isAdmin = user.roles.admin;
    let obj = {};
    if (user.roles.admin && user.roles.bulkuploader) {
      obj = { 'isUserArchived': true, 'isAdminArchived': true };
    } else if (user.roles.admin) {
      obj = { 'isAdminArchived': true };
    } else {
      obj = { 'isUserArchived': true };
    }

    const fireStoreInstance = this.dbService.getFireStore().firestore;
    const upload = fireStoreInstance.batch();
    archiveArray.map((bulkInfo) => {
      const itemDoc = fireStoreInstance.collection('bulk_uploads').doc(bulkInfo.id);
      upload.update(itemDoc, obj);
    });
    return upload.commit();
    // return of(true);
  }

  // get single Bulk Upload
  getBulkUploadFile(bulkId: string): Observable<BulkUploadFileInfo> {
    return this.dbService.valueChanges('bulk_uploads', bulkId)
      .pipe(catchError(error => {
        console.log(error);
        return of(null);
      }));
  }
}
