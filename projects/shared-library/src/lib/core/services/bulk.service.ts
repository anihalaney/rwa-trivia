import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireStorage } from 'angularfire2/storage';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { BulkUploadFileInfo, User } from '../../shared/model';

@Injectable()
export class BulkService {

  constructor(private db: AngularFirestore,
    private storage: AngularFireStorage,
    private http: HttpClient) {
  }

  // get All Bulk Upload
  getBulkUpload(user: User, archive: boolean): Observable<BulkUploadFileInfo[]> {
    if (!archive) {
      return this.db.collection('/bulk_uploads', ref => ref.where('isAdminArchived', '==', archive))
        .valueChanges()
        .pipe(catchError(error => {
          console.log(error);
          return of(null);
        }));

    } else {
      return this.db.collection('/bulk_uploads').valueChanges()
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

    let whereCondition;
    if (!archive) {
      if (user.roles.admin && user.roles.bulkuploader) {
        whereCondition = ref => ref.where('created_uid', '==', user.userId).
          where(userArchive, '==', archive).where(adminArchive, '==', archive);
      } else if (user.roles.admin) {
        whereCondition = ref => ref.where('created_uid', '==', user.userId).
          where(adminArchive, '==', archive);
      } else {
        whereCondition = ref => ref.where('created_uid', '==', user.userId).
          where(userArchive, '==', archive);
      }

    } else {
      whereCondition = ref => ref.where('created_uid', '==', user.userId)
    }

    return this.db.collection('/bulk_uploads', whereCondition)
      .valueChanges()
      .pipe(catchError(error => {
        console.log(error);
        return of(null);
      }));
  }

  // get BulkUpload by Id
  getBulkUploadById(bulkUploadFileInfo: BulkUploadFileInfo): Observable<BulkUploadFileInfo> {
    return this.db.doc(`/bulk_uploads/${bulkUploadFileInfo.id}`)
      .valueChanges()
      .pipe(catchError(error => {
        console.log(error);
        return of(null);
      }));
  }

  // update Bulk Upload
  updateBulkUpload(bulkUploadFileInfo: BulkUploadFileInfo) {
    const dbBulkUploadFileInfo = Object.assign({}, bulkUploadFileInfo); // object to be saved
    // remove download URL it is observable
    delete dbBulkUploadFileInfo.downloadUrl
    this.db.doc('/bulk_uploads/' + dbBulkUploadFileInfo.id).set(dbBulkUploadFileInfo).then(ref => {
    });
  }

  // get File By Bulk Upload File Name
  getFileByBulkUploadFileUrl(bulkUploadFileInfo: BulkUploadFileInfo): Observable<string> {
    const filePath = `bulk_upload/${bulkUploadFileInfo.created_uid}/${bulkUploadFileInfo.id}-${bulkUploadFileInfo.fileName}`;
    const ref = this.storage.ref(filePath);
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
    const upload = this.db.firestore.batch();
    archiveArray.map((bulkInfo) => {
      const itemDoc = this.db.firestore.collection('bulk_uploads').doc(bulkInfo.id);
      upload.update(itemDoc, obj);
    })
    return upload.commit();
    // return of(true);
  }
  // get single Bulk Upload
  getBulkUploadFile(bulkId: string): Observable<BulkUploadFileInfo> {
    return this.db.doc(`/bulk_uploads/${bulkId}`)
      .valueChanges()
      .pipe(catchError(error => {
        console.log(error);
        return of(null);
      }));
  }
}
