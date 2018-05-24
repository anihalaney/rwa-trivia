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
  getBulkUpload(): Observable<BulkUploadFileInfo[]> {
    return this.db.collection('/bulk_uploads').valueChanges()
      .catch(error => {
        console.log(error);
        return Observable.of(null);
      });
  }

  // get Bulk Upload by user Id
  getUserBulkUpload(user: User): Observable<BulkUploadFileInfo[]> {
    return this.db.collection('/bulk_uploads', ref => ref.where('created_uid', '==', user.userId))
      .valueChanges()
      .catch(error => {
        console.log(error);
        return Observable.of(null);
      });


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

  archiveBulkUpload(archiveArray: BulkUploadFileInfo[], user: User): Observable<boolean> {
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
    upload.commit();
    return Observable.of(true);
  }
}
