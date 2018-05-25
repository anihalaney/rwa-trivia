import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';

import { BulkUploadFileInfo, User, Question, BulkUpload } from '../../../model';

export enum BulkActionTypes {
    LOAD_BULK_UPLOAD = '[Bulk] LoadBulkUpload',
    LOAD_BULK_UPLOAD_SUCCESS = '[Bulk] LoadBulkUploadSuccess',
    LOAD_USER_BULK_UPLOAD = '[Bulk] LoadUserBulkUpload',
    LOAD_USER_BULK_UPLOAD_SUCCESS = '[Bulk] LoadUserBulkUploadSuccess',
    LOAD_BULK_UPLOAD_PUBLISHED_QUESTIONS = '[Bulk] LoadBulkUploadPublishedQuestions',
    LOAD_BULK_UPLOAD_PUBLISHED_QUESTIONS_SUCCESS = '[Bulk] LoadBulkUploadPublishedQuestionsSuccess',
    LOAD_BULK_UPLOAD_UNPUBLISHED_QUESTIONS = '[Bulk] LoadBulkUploadUnpublishedQuestions',
    LOAD_BULK_UPLOAD_UNPUBLISHED_QUESTIONS_SUCCESS = '[Bulk] LoadBulkUploadUnpublishedQuestionsSuccess',
    LOAD_BULK_UPLOAD_FILE_URL = '[Bulk] LoadBulkUploadFileUrl',
    LOAD_BULK_UPLOAD_FILE_URL_SUCCESS = '[Bulk] LoadBulkUploadFileUrlSuccess',
    UPDATE_QUESTION = '[Bulk] UpdateQuestion',
    UPDATE_BULK_UPLOAD = '[Bulk] UpdateBulkUpload',
    APPROVE_QUESTION = '[Bulk] ApproveQuestion',
    ADD_BULK_QUESTIONS = '[Bulk] AddBulkQuestion',
    ARCHIVE_BULK_UPLOAD = '[Bulk] ArchiveBulkUpload',
    ARCHIVE_BULK_UPLOAD_SUCCESS = '[Bulk] ArchiveBulkUploadSuccess'
}


// for get all BulkUploadFileInfo
export class LoadBulkUpload implements Action {
    readonly type = BulkActionTypes.LOAD_BULK_UPLOAD;
    payload = null;
}

// for get all BulkUploadFileInfo Success
export class LoadBulkUploadSuccess implements Action {
    readonly type = BulkActionTypes.LOAD_BULK_UPLOAD_SUCCESS;
    constructor(public payload: BulkUploadFileInfo[]) { }
}

// for get BulkUploadFileInfo by User
export class LoadUserBulkUpload implements Action {
    readonly type = BulkActionTypes.LOAD_USER_BULK_UPLOAD;
    constructor(public payload: { user: User, archive: boolean }) { }
}

// for get BulkUploadFileInfo by User Success
export class LoadUserBulkUploadSuccess implements Action {
    readonly type = BulkActionTypes.LOAD_USER_BULK_UPLOAD_SUCCESS;
    constructor(public payload: BulkUploadFileInfo[]) { }
}


// for file PublishedQuestions by BulkUpload Id
export class LoadBulkUploadPublishedQuestions implements Action {
    readonly type = BulkActionTypes.LOAD_BULK_UPLOAD_PUBLISHED_QUESTIONS;
    constructor(public payload: { bulkUploadFileInfo: BulkUploadFileInfo }) { }
}

// for file PublishedQuestions by BulkUpload Id Success
export class LoadBulkUploadPublishedQuestionsSuccess implements Action {
    readonly type = BulkActionTypes.LOAD_BULK_UPLOAD_PUBLISHED_QUESTIONS_SUCCESS;
    constructor(public payload: Question[]) { }
}


// file UnpublishedQuestions by BulkUpload Id
export class LoadBulkUploadUnpublishedQuestions implements Action {
    readonly type = BulkActionTypes.LOAD_BULK_UPLOAD_UNPUBLISHED_QUESTIONS;
    constructor(public payload: { bulkUploadFileInfo: BulkUploadFileInfo }) { }
}

// file UnpublishedQuestions by BulkUpload Id Success
export class LoadBulkUploadUnpublishedQuestionsSuccess implements Action {
    readonly type = BulkActionTypes.LOAD_BULK_UPLOAD_UNPUBLISHED_QUESTIONS_SUCCESS;
    constructor(public payload: Question[]) { }
}

// Load Bulk Upload File Url
export class LoadBulkUploadFileUrl implements Action {
    readonly type = BulkActionTypes.LOAD_BULK_UPLOAD_FILE_URL;
    constructor(public payload: { bulkUploadFileInfo: BulkUploadFileInfo }) { }
}

// Load Bulk Upload File Url Success
export class LoadBulkUploadFileUrlSuccess implements Action {
    readonly type = BulkActionTypes.LOAD_BULK_UPLOAD_FILE_URL_SUCCESS;
    constructor(public payload: string) { }
}


// update Questions
export class UpdateQuestion implements Action {
    readonly type = BulkActionTypes.UPDATE_QUESTION;
    constructor(public payload: { question: Question }) { }
}

// update Questions
export class UpdateBulkUpload implements Action {
    readonly type = BulkActionTypes.UPDATE_BULK_UPLOAD;
    constructor(public payload: { bulkUploadFileInfo: BulkUploadFileInfo }) { }
}

// approve  Questions
export class ApproveQuestion implements Action {
    readonly type = BulkActionTypes.APPROVE_QUESTION;
    constructor(public payload: { question: Question }) { }
}

// add bulk Question
export class AddBulkQuestions implements Action {
    readonly type = BulkActionTypes.ADD_BULK_QUESTIONS;
    constructor(public payload: { bulkUpload: BulkUpload }) { }
}

// archive bulk upload
export class ArchiveBulkUpload implements Action {
    readonly type = BulkActionTypes.ARCHIVE_BULK_UPLOAD;
    constructor(public payload: { archiveArray: BulkUploadFileInfo[], user: User }) { }
}

// archive bulk upload Success
export class ArchiveBulkUploadSuccess implements Action {
    readonly type = BulkActionTypes.ARCHIVE_BULK_UPLOAD_SUCCESS;
    payload = null;
}


export type BulkActions
    = LoadBulkUpload
    | LoadBulkUploadSuccess
    | LoadUserBulkUpload
    | LoadUserBulkUploadSuccess
    | LoadBulkUploadPublishedQuestions
    | LoadBulkUploadPublishedQuestionsSuccess
    | LoadBulkUploadUnpublishedQuestions
    | LoadBulkUploadUnpublishedQuestionsSuccess
    | LoadBulkUploadFileUrl
    | LoadBulkUploadFileUrlSuccess
    | UpdateQuestion
    | UpdateBulkUpload
    | ApproveQuestion
    | AddBulkQuestions
    | ArchiveBulkUpload
    | ArchiveBulkUploadSuccess
