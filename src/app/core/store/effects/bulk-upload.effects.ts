import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';

import { AppStore } from '../app-store';
import { Question, User, SearchResults, SearchCriteria, BulkUploadFileInfo } from '../../../model';
import { ActionWithPayload, BulkUploadActions } from '../actions';
import { BulkService } from '../../services'

@Injectable()
export class BulkUploadEffects {
    constructor(
        private actions$: Actions,
        private Actions: BulkUploadActions,
        private svc: BulkService
    ) { }

    @Effect() 
    loadFileRecord$ = this.actions$
        .ofType(BulkUploadActions.LOAD_FILE_RECORD)
        .switchMap(() => this.svc.loadFileRecord())
        .map((bulkUploadInfoFile: BulkUploadFileInfo[]) => this.Actions.loadFileRecordSuccess(bulkUploadInfoFile))
}
