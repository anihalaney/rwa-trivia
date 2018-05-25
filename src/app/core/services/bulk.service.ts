import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireStorage } from 'angularfire2/storage';
import { Observable } from 'rxjs/Observable';
import '../../rxjs-extensions';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Category } from '../../model/category';
import { BulkUploadFileInfo, User, BulkUpload } from '../../model';

@Injectable()
export class BulkService {

  constructor(private db: AngularFirestore,
    private storage: AngularFireStorage,
    private http: HttpClient) {
  }

  // get All Bulk Upload
  getBulkUpload(archive: boolean): Observable<BulkUploadFileInfo[]> {
    if (!archive) {
      const adminArchived = this.db.collection('/bulk_uploads', ref => ref.where('isAdminArchived', '==', archive))
        .valueChanges()
        .catch(error => {
          console.log(error);
          return Observable.of(null);
        });

      const userArchived = this.db.collection('/bulk_uploads', ref => ref.where('isUserArchived', '==', archive))
        .valueChanges()
        .catch(error => {
          console.log(error);
          return Observable.of(null);
        });
      return Observable.combineLatest(adminArchived, userArchived).map(([bT, sT]) => [...bT, ...sT]);

    } else {
      return this.db.collection('/bulk_uploads').valueChanges()
        .catch(error => {
          console.log(error);
          return Observable.of(null);
        });
    }




  }

  // get Bulk Upload by user Id
  getUserBulkUpload(user: User, archive: boolean): Observable<BulkUploadFileInfo[]> {
    let key = '';

    const adminArchive = 'isAdminArchived';
    const userArchive = 'isUserArchived';

    let whereCondition;
    let whereCondition1;
    if (!archive) {
      whereCondition = ref => ref.where('created_uid', '==', user.userId).
        where(adminArchive, '==', archive);
      whereCondition1 = ref => ref.where('created_uid', '==', user.userId).
        where(userArchive, '==', archive);

    } else {
      whereCondition = ref => ref.where('created_uid', '==', user.userId)
    }

    if (user.roles.admin && user.roles.bulkuploader) {
      const adminArchived = this.db.collection('/bulk_uploads', whereCondition)
        .valueChanges()
        .catch(error => {
          console.log(error);
          return Observable.of(null);
        });

      const userArchived = this.db.collection('/bulk_uploads', whereCondition1)
        .valueChanges()
        .catch(error => {
          console.log(error);
          return Observable.of(null);
        });
      return Observable.combineLatest(adminArchived, userArchived).map(([bT, sT]) => [...bT, ...sT]);
    } else {
      if (user.roles.admin) {
        key = adminArchive;
      } else {
        key = userArchive;
      }
      return this.db.collection('/bulk_uploads', whereCondition)
        .valueChanges()
        .catch(error => {
          console.log(error);
          return Observable.of(null);
        });
    }



  }

  // get BulkUpload by Id
  getBulkUploadById(bulkUploadFileInfo: BulkUploadFileInfo): Observable<BulkUploadFileInfo> {
    return this.db.doc(`/bulk_uploads/${bulkUploadFileInfo.id}`)
      .valueChanges()
      .catch(error => {
        console.log(error);
        return Observable.of(null);
      });
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
    return ref.getDownloadURL().map(url => url);
  }

  archiveBulkUpload(archiveArray: BulkUploadFileInfo[], user: User) {
    const isAdmin = user.roles.admin;
    let obj = {};
    if (!isAdmin) {
      obj = { 'isUserArchived': true };
    } else {
      obj = { 'isAdminArchived': true };
    }
    const upload = this.db.firestore.batch();
    archiveArray.map((bulkInfo) => {
      const itemDoc = this.db.firestore.collection('bulk_uploads').doc(bulkInfo.id);
      upload.update(itemDoc, obj);
    })
    return upload.commit();
    // return Observable.of(true);
  }
}
