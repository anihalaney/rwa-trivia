import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { switchMap, map } from 'rxjs/operators';
import { empty } from 'rxjs/observable/empty';

import { BulkUploadFileInfo } from '../../../model';
import { BulkActions, BulkActionTypes } from '../actions';
import * as bulkactions from '../actions/bulk.actions';
import { BulkService } from '../../../core/services';

@Injectable()
export class BulkEffects {
    constructor(
        private actions$: Actions,
        private svc: BulkService
    ) { }

    @Effect()
    loadBulkUpload$ = this.actions$
        .ofType(BulkActionTypes.LOAD_BULK_UPLOAD)
        .pipe(
        switchMap((action: bulkactions.LoadBulkUpload) =>
            this.svc.getBulkUpload().pipe(
                map((bulkUploadFileInfo: BulkUploadFileInfo[]) => new bulkactions.LoadBulkUploadSuccess(bulkUploadFileInfo))
            )
        )
        );
}