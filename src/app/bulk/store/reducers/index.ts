import { ActionReducerMap, createSelector, createFeatureSelector } from '@ngrx/store';

import { BulkUploadFileInfo, Question } from '../../../model';
import { bulkUploadFileInfos, userBulkUploadFileInfos, bulkUploadPublishedQuestions, bulkUploadUnpublishedQuestions } from './bulk.reducer';

export * from './bulk.reducer';

export interface BulkState {
    bulkUploadFileInfos: BulkUploadFileInfo[];
    userBulkUploadFileInfos: BulkUploadFileInfo[];
    bulkUploadPublishedQuestions: Question[];
    bulkUploadUnpublishedQuestions: Question[];
}

export const reducer: ActionReducerMap<BulkState> = {
    bulkUploadFileInfos: bulkUploadFileInfos,
    userBulkUploadFileInfos: userBulkUploadFileInfos,
    bulkUploadPublishedQuestions: bulkUploadPublishedQuestions,
    bulkUploadUnpublishedQuestions: bulkUploadUnpublishedQuestions
};

export const bulkState = createFeatureSelector<BulkState>('bulk');