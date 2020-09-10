import { BulkUploadFileInfo, Question } from 'shared-library/shared/model';
import { BulkActionTypes } from '../actions';
import { testData } from 'test/data';
import {
    bulkUploadFileInfos, userBulkUploadFileInfos, bulkUploadPublishedQuestions,
    bulkUploadUnpublishedQuestions, bulkUploadFileUrl, bulkUploadArchiveStatus,
    bulkUploadFileInfo, getArchiveToggleState, getArchiveList
} from './bulk.reducer';


describe('BulkReducer: bulkUploadFileInfos', () => {
    const _testReducer = bulkUploadFileInfos;

    it('Initial State', () => {
        const state: any[] = _testReducer(undefined, { type: null, payload: null });
        expect(state).toEqual([]);
    });

    it('Get bulkUploadFileInfos', () => {
        const bulkUploadFileInfo = new BulkUploadFileInfo();
        const bulkUploadId = 'cce85s8e52x4ex';
        bulkUploadFileInfo.id = bulkUploadId;
        bulkUploadFileInfo.categoryId = 1;
        const newState: any[] = _testReducer([bulkUploadFileInfo],
            { type: BulkActionTypes.LOAD_BULK_UPLOAD_SUCCESS, payload: [bulkUploadFileInfo] });
        expect(newState).toEqual([bulkUploadFileInfo]);
    });
});

describe('BulkReducer: userBulkUploadFileInfos', () => {
    const _testReducer = userBulkUploadFileInfos;
    it('Initial State', () => {
        const state: any[] = _testReducer(undefined, { type: null, payload: null });
        expect(state).toEqual([]);
    });
    it('Get userBulkUploadFileInfos', () => {
        const bulkUploadFileInfo = new BulkUploadFileInfo();
        const bulkUploadId = 'cce85s8e52x4ex';
        bulkUploadFileInfo.id = bulkUploadId;
        bulkUploadFileInfo.categoryId = 1;
        const newState: any[] = _testReducer([bulkUploadFileInfo],
            { type: BulkActionTypes.LOAD_USER_BULK_UPLOAD_SUCCESS, payload: [bulkUploadFileInfo] });
        expect(newState).toEqual([bulkUploadFileInfo]);
    });
});

describe('BulkReducer: bulkUploadPublishedQuestions', () => {
    const _testReducer = bulkUploadPublishedQuestions;
    const questions: Question[] = testData.questions.published;

    it('Initial State', () => {
        const state: any[] = _testReducer(undefined, { type: null, payload: null });
        expect(state).toEqual([]);
    });

    it('Get bulkUploadPublishedQuestions', () => {
        const newState: any[] = _testReducer(questions,
            { type: BulkActionTypes.LOAD_BULK_UPLOAD_PUBLISHED_QUESTIONS_SUCCESS, payload: questions });
        expect(newState).toEqual(questions);
    });
});


describe('BulkReducer: bulkUploadUnpublishedQuestions', () => {
    const _testReducer = bulkUploadUnpublishedQuestions;
    const questions: Question[] = testData.questions.unpublished;

    it('Initial State', () => {
        const state: any[] = _testReducer(undefined, { type: null, payload: null });
        expect(state).toEqual([]);
    });

    it('Get bulkUploadUnpublishedQuestions', () => {
        const newState: any[] = _testReducer(questions,
            { type: BulkActionTypes.LOAD_BULK_UPLOAD_PUBLISHED_QUESTIONS_SUCCESS, payload: questions });
        expect(newState).toEqual(questions);
    });
});


describe('BulkReducer: bulkUploadFileUrl', () => {
    const _testReducer = bulkUploadFileUrl;
    const fileUrl = 'fileUrl';

    it('Initial State', () => {
        const state: string = _testReducer(undefined, { type: null, payload: null });
        expect(state).toEqual(null);
    });

    it('Get bulkUploadFileUrl', () => {
        const newState: string = _testReducer(fileUrl,
            { type: BulkActionTypes.LOAD_BULK_UPLOAD_FILE_URL_SUCCESS, payload: fileUrl });
        expect(newState).toEqual(fileUrl);
    });
});

describe('BulkReducer: bulkUploadArchiveStatus', () => {
    const _testReducer = bulkUploadArchiveStatus;
    const archived = 'ARCHIVED';

    it('Initial State', () => {
        const state: string = _testReducer(undefined, { type: null, payload: null });
        expect(state).toEqual(null);
    });

    it('Get bulkUploadArchiveStatus', () => {
        const newState: string = _testReducer(archived,
            { type: BulkActionTypes.ARCHIVE_BULK_UPLOAD_SUCCESS, payload: archived });
        expect(newState).toEqual(archived);
    });
});

describe('BulkReducer: bulkUploadFileInfo', () => {
    const _testReducer = bulkUploadFileInfo;
    const bulkUploadFileInfoObj = new BulkUploadFileInfo();
    const bulkUploadId = 'cce85s8e52x4ex';
    bulkUploadFileInfoObj.id = bulkUploadId;
    bulkUploadFileInfoObj.categoryId = 1;;

    it('Initial State', () => {
        const state: any = _testReducer(undefined, { type: null, payload: null });
        expect(state).toEqual(undefined);
    });

    it('Get bulkUploadFileInfo', () => {
        const newState: any = _testReducer(bulkUploadFileInfoObj,
            { type: BulkActionTypes.LOAD_BULK_UPLOAD_FILE_SUCCESS, payload: bulkUploadFileInfoObj });
        expect(newState).toEqual(bulkUploadFileInfoObj);
    });
});

describe('BulkReducer: getArchiveToggleState', () => {
    const _testReducer = getArchiveToggleState;
    it('Initial State', () => {
        const state: any = _testReducer(undefined, { type: null, payload: null });
        expect(state).toEqual(null);
    });

    it('Get getArchiveToggleState', () => {
        const newState: any = _testReducer(true,
            { type: BulkActionTypes.SAVE_ARCHIVE_TOGGLE_STATE, payload: { toggle_state: true } });
        expect(newState).toEqual(true);
    });
});

describe('BulkReducer: getArchiveList', () => {
    const _testReducer = getArchiveList;
    const bulkUploadFileInfo = new BulkUploadFileInfo();
    const bulkUploadId = 'cce85s8e52x4ex';
    bulkUploadFileInfo.id = bulkUploadId;
    bulkUploadFileInfo.categoryId = 1;

    it('Initial State', () => {
        const state: any[] = _testReducer(undefined, { type: null, payload: null });
        expect(state).toEqual([]);
    });

    it('Get getArchiveList', () => {
        const newState: any[] = _testReducer([bulkUploadFileInfo],
            { type: BulkActionTypes.SAVE_ARCHIVE_LIST, payload: [bulkUploadFileInfo] });
        expect(newState).toEqual([bulkUploadFileInfo]);
    });
});
