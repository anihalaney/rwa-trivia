import { User, Question, BulkUpload, BulkUploadFileInfo } from 'shared-library/shared/model';
import * as BulkActions from './bulk.actions';
import { testData } from 'test/data';


describe('BulkAction: LoadBulkUpload', () => {
    it('should create an action', () => {
        const user: User = testData.userList[0];
        const action = new BulkActions.LoadBulkUpload({ user: user, archive: true });
        expect(action.type).toEqual(BulkActions.BulkActionTypes.LOAD_BULK_UPLOAD);
        expect(action.payload).toEqual({ user: user, archive: true });
    });
});

describe('BulkAction: LoadBulkUploadSuccess', () => {
    it('should create an action', () => {
        const bulkUploadFileInfo = new BulkUploadFileInfo();
        const bulkUploadId = 'cce85s8e52x4ex';
        bulkUploadFileInfo.id = bulkUploadId;
        bulkUploadFileInfo.categoryId = 1;
        const user: User = testData.userList[0];
        const action = new BulkActions.LoadBulkUploadSuccess([bulkUploadFileInfo]);
        expect(action.type).toEqual(BulkActions.BulkActionTypes.LOAD_BULK_UPLOAD_SUCCESS);
        expect(action.payload).toEqual([bulkUploadFileInfo]);
    });
});


describe('BulkAction: LoadUserBulkUpload', () => {
    it('should create an action', () => {
        const user: User = testData.userList[0];
        const action = new BulkActions.LoadUserBulkUpload({ user: user, archive: true });
        expect(action.type).toEqual(BulkActions.BulkActionTypes.LOAD_USER_BULK_UPLOAD);
        expect(action.payload).toEqual({ user: user, archive: true });
    });
});

describe('BulkAction: LoadBulkUploadPublishedQuestions', () => {
    it('should create an action', () => {
        const bulkUploadFileInfo = new BulkUploadFileInfo();
        const bulkUploadId = 'cce85s8e52x4ex';
        bulkUploadFileInfo.id = bulkUploadId;
        bulkUploadFileInfo.categoryId = 1;
        const action = new BulkActions.LoadBulkUploadPublishedQuestions({ bulkUploadFileInfo });
        expect(action.type).toEqual(BulkActions.BulkActionTypes.LOAD_BULK_UPLOAD_PUBLISHED_QUESTIONS);
        expect(action.payload).toEqual({ bulkUploadFileInfo });
    });
});


describe('BulkAction: LoadBulkUploadPublishedQuestions', () => {
    it('should create an action', () => {
        const questions = testData.questions.published;
        const action = new BulkActions.LoadBulkUploadPublishedQuestionsSuccess(questions);
        expect(action.type).toEqual(BulkActions.BulkActionTypes.LOAD_BULK_UPLOAD_PUBLISHED_QUESTIONS_SUCCESS);
        expect(action.payload).toEqual(questions);
    });

});


describe('BulkAction: LoadBulkUploadUnpublishedQuestions', () => {
    it('should create an action', () => {
        const bulkUploadFileInfo = new BulkUploadFileInfo();
        const bulkUploadId = 'cce85s8e52x4ex';
        bulkUploadFileInfo.id = bulkUploadId;
        bulkUploadFileInfo.categoryId = 1;
        const action = new BulkActions.LoadBulkUploadUnpublishedQuestions({ bulkUploadFileInfo });
        expect(action.type).toEqual(BulkActions.BulkActionTypes.LOAD_BULK_UPLOAD_UNPUBLISHED_QUESTIONS);
        expect(action.payload).toEqual({ bulkUploadFileInfo });
    });
});


describe('BulkAction: LoadBulkUploadUnpublishedQuestionsSuccess', () => {
    it('should create an action', () => {
        const questions = testData.questions.unpublished;
        const action = new BulkActions.LoadBulkUploadUnpublishedQuestionsSuccess(questions);
        expect(action.type).toEqual(BulkActions.BulkActionTypes.LOAD_BULK_UPLOAD_UNPUBLISHED_QUESTIONS_SUCCESS);
        expect(action.payload).toEqual(questions);
    });
});

describe('BulkAction: LoadBulkUploadFileUrl', () => {
    it('should create an action', () => {
        const bulkUploadFileInfo = new BulkUploadFileInfo();
        const bulkUploadId = 'cce85s8e52x4ex';
        bulkUploadFileInfo.id = bulkUploadId;
        bulkUploadFileInfo.categoryId = 1;
        const action = new BulkActions.LoadBulkUploadFileUrl({ bulkUploadFileInfo });
        expect(action.type).toEqual(BulkActions.BulkActionTypes.LOAD_BULK_UPLOAD_FILE_URL);
        expect(action.payload).toEqual({ bulkUploadFileInfo });
    });
});

describe('BulkAction: LoadBulkUploadFileUrlSuccess', () => {
    it('should create an action', () => {
        const action = new BulkActions.LoadBulkUploadFileUrlSuccess('fileUrl');
        expect(action.type).toEqual(BulkActions.BulkActionTypes.LOAD_BULK_UPLOAD_FILE_URL_SUCCESS);
        expect(action.payload).toEqual('fileUrl');
    });

    describe('BulkAction: UpdateBulkUpload', () => {
        it('should create an action', () => {
            const bulkUploadFileInfo = new BulkUploadFileInfo();
            const bulkUploadId = 'cce85s8e52x4ex';
            bulkUploadFileInfo.id = bulkUploadId;
            bulkUploadFileInfo.categoryId = 1;
            const action = new BulkActions.UpdateBulkUpload({ bulkUploadFileInfo });
            expect(action.type).toEqual(BulkActions.BulkActionTypes.UPDATE_BULK_UPLOAD);
            expect(action.payload).toEqual({ bulkUploadFileInfo });
        });
    });

    describe('BulkAction: UpdateBulkUpload', () => {
        it('should create an action', () => {
            const bulkUpload = new BulkUpload();
            const action = new BulkActions.AddBulkQuestions({ bulkUpload });
            expect(action.type).toEqual(BulkActions.BulkActionTypes.ADD_BULK_QUESTIONS);
            expect(action.payload).toEqual({ bulkUpload });
        });
    });

    describe('BulkAction: ArchiveBulkUpload', () => {
        it('should create an action', () => {
            const user: User = testData.userList[0];
            const bulkUploadFileInfo = new BulkUploadFileInfo();
            const bulkUploadId = 'cce85s8e52x4ex';
            bulkUploadFileInfo.id = bulkUploadId;
            bulkUploadFileInfo.categoryId = 1;
            const action = new BulkActions.ArchiveBulkUpload({ archiveArray: [bulkUploadFileInfo], user });
            expect(action.type).toEqual(BulkActions.BulkActionTypes.ARCHIVE_BULK_UPLOAD);
            expect(action.payload).toEqual({ archiveArray: [bulkUploadFileInfo], user });
        });
    });


    describe('BulkAction: ArchiveBulkUploadSuccess', () => {
        it('should create an action', () => {
            const action = new BulkActions.ArchiveBulkUploadSuccess();
            expect(action.type).toEqual(BulkActions.BulkActionTypes.ARCHIVE_BULK_UPLOAD_SUCCESS);
            expect(action.payload).toEqual(null);
        });
    });

    describe('BulkAction: LoadBulkUploadFile', () => {
        it('should create an action', () => {
            const bulkId = 'isOdleDse525se';
            const action = new BulkActions.LoadBulkUploadFile({ bulkId });
            expect(action.type).toEqual(BulkActions.BulkActionTypes.LOAD_BULK_UPLOAD_FILE);
            expect(action.payload).toEqual({ bulkId });
        });
    });

    describe('BulkAction: LoadBulkUploadFileSuccess', () => {
        it('should create an action', () => {
            const bulkUploadFileInfo = new BulkUploadFileInfo();
            const bulkUploadId = 'cce85s8e52x4ex';
            bulkUploadFileInfo.id = bulkUploadId;
            bulkUploadFileInfo.categoryId = 1;
            const action = new BulkActions.LoadBulkUploadFileSuccess(bulkUploadFileInfo);
            expect(action.type).toEqual(BulkActions.BulkActionTypes.LOAD_BULK_UPLOAD_FILE_SUCCESS);
            expect(action.payload).toEqual(bulkUploadFileInfo);
        });
    });

    describe('BulkAction: SaveArchiveToggleState', () => {
        it('should create an action', () => {
            const action = new BulkActions.SaveArchiveToggleState({ toggle_state: true });
            expect(action.type).toEqual(BulkActions.BulkActionTypes.SAVE_ARCHIVE_TOGGLE_STATE);
            expect(action.payload).toEqual({ toggle_state: true });
        });
    });

    describe('BulkAction: SaveArchiveList', () => {
        it('should create an action', () => {
            const bulkUploadFileInfo = new BulkUploadFileInfo();
            const bulkUploadId = 'cce85s8e52x4ex';
            bulkUploadFileInfo.id = bulkUploadId;
            bulkUploadFileInfo.categoryId = 1;

            const action = new BulkActions.SaveArchiveList([bulkUploadFileInfo]);
            expect(action.type).toEqual(BulkActions.BulkActionTypes.SAVE_ARCHIVE_LIST);
            expect(action.payload).toEqual([bulkUploadFileInfo]);
        });
    });
});
