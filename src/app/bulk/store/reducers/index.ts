import { ActionReducerMap, createSelector, createFeatureSelector } from '@ngrx/store';

import { BulkUploadFileInfo, Question } from '../../../model';
import {
    bulkUploadFileInfos, userBulkUploadFileInfos,
    bulkUploadPublishedQuestions, bulkUploadUnpublishedQuestions, questionSaveStatus,
    bulkUploadFileUrl, bulkUploadArchiveStatus
} from './bulk.reducer';

export * from './bulk.reducer';

export interface BulkState {
    bulkUploadFileInfos: BulkUploadFileInfo[];
    userBulkUploadFileInfos: BulkUploadFileInfo[];
    bulkUploadPublishedQuestions: Question[];
    bulkUploadUnpublishedQuestions: Question[];
    questionSaveStatus: String;
    bulkUploadFileUrl: string;
    bulkUploadArchiveStatus: string;
}

export const reducer: ActionReducerMap<BulkState> = {
    bulkUploadFileInfos: bulkUploadFileInfos,
    userBulkUploadFileInfos: userBulkUploadFileInfos,
    bulkUploadPublishedQuestions: bulkUploadPublishedQuestions,
    bulkUploadUnpublishedQuestions: bulkUploadUnpublishedQuestions,
    questionSaveStatus: questionSaveStatus,
    bulkUploadFileUrl: bulkUploadFileUrl,
    bulkUploadArchiveStatus: bulkUploadArchiveStatus
};

export const bulkState = createFeatureSelector<BulkState>('bulk');
