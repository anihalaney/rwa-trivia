import { ActionReducerMap, createSelector, createFeatureSelector } from '@ngrx/store';

import { BulkUploadFileInfo, Question } from '../../../../../../shared-library/src/public_api';
import {
    bulkUploadFileInfos, userBulkUploadFileInfos,
    bulkUploadPublishedQuestions, bulkUploadUnpublishedQuestions, questionSaveStatus,
    bulkUploadFileUrl, bulkUploadArchiveStatus, bulkUploadFileInfo, getArchiveToggleState, getArchiveList
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
    bulkUploadFileInfo: BulkUploadFileInfo;
    getArchiveToggleState: boolean;
    getArchiveList: BulkUploadFileInfo[];
}

export const reducer: ActionReducerMap<BulkState> = {
    bulkUploadFileInfos: bulkUploadFileInfos,
    userBulkUploadFileInfos: userBulkUploadFileInfos,
    bulkUploadPublishedQuestions: bulkUploadPublishedQuestions,
    bulkUploadUnpublishedQuestions: bulkUploadUnpublishedQuestions,
    questionSaveStatus: questionSaveStatus,
    bulkUploadFileUrl: bulkUploadFileUrl,
    bulkUploadArchiveStatus: bulkUploadArchiveStatus,
    bulkUploadFileInfo: bulkUploadFileInfo,
    getArchiveToggleState: getArchiveToggleState,
    getArchiveList: getArchiveList
};

export const bulkState = createFeatureSelector<BulkState>('bulk');
