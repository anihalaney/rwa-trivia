import { BulkUploadFileInfo, Question } from 'shared-library/shared/model';
import { BulkActions, BulkActionTypes } from '../actions';


// for get all BulkUploadFileInfo
export function bulkUploadFileInfos(state: any = [], action: BulkActions): BulkUploadFileInfo[] {
    switch (action.type) {
        case BulkActionTypes.LOAD_BULK_UPLOAD_SUCCESS:
            return action.payload;
        default:
            return state;
    }
}

// for get BulkUploadFileInfo by User
export function userBulkUploadFileInfos(state: any = [], action: BulkActions): BulkUploadFileInfo[] {
    switch (action.type) {
        case BulkActionTypes.LOAD_USER_BULK_UPLOAD_SUCCESS:
            return action.payload;
        default:
            return state;
    }
}

// for file PublishedQuestions by BulkUpload Id
export function bulkUploadPublishedQuestions(state: any = [], action: BulkActions): Question[] {
    switch (action.type) {
        case BulkActionTypes.LOAD_BULK_UPLOAD_PUBLISHED_QUESTIONS_SUCCESS:
            return action.payload;
        default:
            return state;
    }
}


// file UnpublishedQuestions by BulkUpload Id
export function bulkUploadUnpublishedQuestions(state: any = [], action: BulkActions): Question[] {
    switch (action.type) {
        case BulkActionTypes.LOAD_BULK_UPLOAD_UNPUBLISHED_QUESTIONS_SUCCESS:
            return action.payload;
        default:
            return state;
    }
}

// for get BulkUploadFileUrl
export function bulkUploadFileUrl(state: string, action: BulkActions): string {
    switch (action.type) {
        case BulkActionTypes.LOAD_BULK_UPLOAD_FILE_URL_SUCCESS:
            return action.payload;
        default:
            return null;
    }
}


// question save Status
export function questionSaveStatus(state: any = 'NONE', action: BulkActions): string {
    switch (action.type) {
        case BulkActionTypes.UPDATE_QUESTION:
            return 'UPDATE';
        default:
            return null;
    }
}

// archive bulk upload Status
export function bulkUploadArchiveStatus(state: any = 'NONE', action: BulkActions): string {
    switch (action.type) {
        case BulkActionTypes.ARCHIVE_BULK_UPLOAD_SUCCESS:
            return 'ARCHIVED';
        default:
            return null;
    }
}

// for get single BulkUploadFileInfo Object
export function bulkUploadFileInfo(state: any, action: BulkActions): BulkUploadFileInfo {
    switch (action.type) {
        case BulkActionTypes.LOAD_BULK_UPLOAD_FILE_SUCCESS:
            return action.payload;
        default:
            return state;
    }
}

// Get Archive Toggle stat
export function getArchiveToggleState(state: any = null, action: BulkActions): boolean {
    switch (action.type) {
        case BulkActionTypes.SAVE_ARCHIVE_TOGGLE_STATE:
            return action.payload.toggle_state;
        default:
            return state;
    }
}

// Get Archive Toggle stat
export function getArchiveList(state = [], action: BulkActions): BulkUploadFileInfo[] {
    switch (action.type) {
        case BulkActionTypes.SAVE_ARCHIVE_LIST:
            return [...action.payload];
        default:
            return state;
    }
}
