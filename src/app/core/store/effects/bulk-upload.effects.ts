import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';

import { AppStore } from '../app-store';
import { Question, User, SearchResults, SearchCriteria, BulkUploadFileInfo } from '../../../model';
import { ActionWithPayload, BulkUploadActions } from '../actions';
import { BulkService } from '../../services'

@Injectable()
export class BulkUploadEffects {
    @Effect()
    loadBulkUpload$ = this.actions$
        .ofType(BulkUploadActions.LOAD_BULK_UPLOAD)
        .switchMap(() => this.svc.getBulkUpload())
        .map((bulkUploadInfoFile: BulkUploadFileInfo[]) => this.bulkUploadAction.loadBulkUploadSuccess(bulkUploadInfoFile));

    @Effect()
    loadUserBulkUpload$ = this.actions$
        .ofType(BulkUploadActions.LOAD_USER_BULK_UPLOAD)
        .switchMap((action: ActionWithPayload<User>) => this.svc.getUserBulkUpload(action.payload))
        .map((bulkUploadFileInfos: BulkUploadFileInfo[]) => this.bulkUploadAction.loadUserBulkUploadSuccess(bulkUploadFileInfos));


    @Effect()
    loadBulkUploadById$ = this.actions$
        .ofType(BulkUploadActions.LOAD_BULK_UPLOAD_BY_ID)
        .switchMap((action: ActionWithPayload<BulkUploadFileInfo>) => this.svc.getBulkUploadById(action.payload))
        .map((bulkUploadFileInfos: BulkUploadFileInfo) => this.bulkUploadAction.loadBulkUploadByIdSuccess(bulkUploadFileInfos));


        // update Question
    @Effect()
    updateBulkUpload$ = this.actions$
        .ofType(BulkUploadActions.UPDATE_BULK_UPLOAD)
        .do((action: ActionWithPayload<BulkUploadFileInfo>) => this.svc.updateBulkUpload(action.payload))
        .filter(() => false);

    constructor(
        private actions$: Actions,
        private bulkUploadAction: BulkUploadActions,
        private svc: BulkService
    ) { }


}
