import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';

import { BulkUploadFileInfo, User, Question } from '../../../model';

export enum BulkActionTypes {
    LOAD_BULK_UPLOAD = '[Bulk] LoadBulkUpload',
    LOAD_BULK_UPLOAD_SUCCESS = '[Bulk] LoadBulkUploadSuccess',
    LOAD_USER_BULK_UPLOAD = '[Bulk] LoadUserBulkUpload',
    LOAD_USER_BULK_UPLOAD_SUCCESS = '[Bulk] LoadUserBulkUploadSuccess',
    LOAD_BULK_UPLOAD_PUBLISHED_QUESTIONS = '[Bulk] LoadBulkUploadPublishedQuestions',
    LOAD_BULK_UPLOAD_PUBLISHED_QUESTIONS_SUCCESS = '[Bulk] LoadBulkUploadPublishedQuestionsSuccess',
    LOAD_BULK_UPLOAD_UNPUBLISHED_QUESTIONS = '[Bulk] LoadBulkUploadUnpublishedQuestions',
    LOAD_BULK_UPLOAD_UNPUBLISHED_QUESTIONS_SUCCESS = '[Bulk] LoadBulkUploadUnpublishedQuestionsSuccess',
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
    constructor(public payload: { user: User }) { }
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


export type BulkActions
    = LoadBulkUpload
    | LoadBulkUploadSuccess
    | LoadUserBulkUpload
    | LoadUserBulkUploadSuccess
    | LoadBulkUploadPublishedQuestions
    | LoadBulkUploadPublishedQuestionsSuccess
    | LoadBulkUploadUnpublishedQuestions
    | LoadBulkUploadUnpublishedQuestionsSuccess
