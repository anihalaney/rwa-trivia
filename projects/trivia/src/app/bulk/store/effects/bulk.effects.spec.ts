import { Observable } from 'rxjs';
import { QuestionService, BulkService } from 'shared-library/core/services';
import { TestBed, async } from '@angular/core/testing';
import * as BulkActions from '../actions';
import { provideMockActions } from '@ngrx/effects/testing';
import { Actions } from '@ngrx/effects';
import { hot, cold } from 'jest-marbles';
import { testData } from 'test/data';
import { User, Question, BulkUploadFileInfo, BulkUpload } from 'shared-library/shared/model';
import { BulkEffects } from './bulk.effects';
import { StoreModule, MemoizedSelector, Store } from '@ngrx/store';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { coreState, CoreState } from 'shared-library/core/store';


describe('BulkEffects:', () => {
    let effects: BulkEffects;
    let actions$: Observable<any>;
    let questionService: QuestionService;
    let bulkService: BulkService;
    let mockStore: MockStore<CoreState>;
    let mockCoreSelector: MemoizedSelector<CoreState, Partial<CoreState>>;
    const user: User = testData.userList[0];
    const bulkUploadFileInfo = new BulkUploadFileInfo();
    const bulkUploadId = 'cce85s8e52x4ex';
    bulkUploadFileInfo.id = bulkUploadId;
    bulkUploadFileInfo.categoryId = 1;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [StoreModule.forRoot({})],
            providers: [
                {
                    provide: QuestionService,
                    useValue: {}
                },
                {
                    provide: BulkService,
                    useValue: {}
                },
                BulkEffects,
                provideMockStore({
                    initialState: { 'core': { user } },
                    selectors: [
                        {
                            selector: coreState,
                            value: { user }
                        }
                    ]
                }),
                provideMockActions(() => actions$),
            ],
        });
        mockStore = TestBed.get(Store);
        mockCoreSelector = mockStore.overrideSelector<CoreState, Partial<CoreState>>(coreState, { user });
        effects = TestBed.get(BulkEffects);
        questionService = TestBed.get(QuestionService);
        bulkService = TestBed.get(BulkService);
        actions$ = TestBed.get(Actions);
        mockStore.refreshState();
    }));
    // loadBulkUpload
    it('loadBulkUpload', () => {
        const archive = true;
        const completion = new BulkActions.LoadBulkUploadSuccess([bulkUploadFileInfo]);
        const action = new BulkActions.LoadBulkUpload({ user, archive });
        actions$ = hot('-a---', { a: action });
        const response = cold('-a|', { a: [bulkUploadFileInfo] });
        const expected = cold('--b', { b: completion });
        bulkService.getBulkUpload = jest.fn(() => response);
        expect(effects.loadBulkUpload$).toBeObservable(expected);
    });


    // LoadUserBulkUpload
    it('LoadUserBulkUpload', () => {
        const archive = true;
        const completion = new BulkActions.LoadUserBulkUploadSuccess([bulkUploadFileInfo]);
        const action = new BulkActions.LoadUserBulkUpload({ user, archive });
        actions$ = hot('-a---', { a: action });
        const response = cold('-a|', { a: [bulkUploadFileInfo] });
        const expected = cold('--b', { b: completion });
        bulkService.getUserBulkUpload = jest.fn(() => response);
        expect(effects.loadUserBulkUpload$).toBeObservable(expected);
    });

    // loadBulkUploadPublishedQuestions
    it('loadBulkUploadPublishedQuestions', () => {
        const questions: Question[] = testData.questions.published;
        const completion = new BulkActions.LoadBulkUploadPublishedQuestionsSuccess(questions);
        const action = new BulkActions.LoadBulkUploadPublishedQuestions({ bulkUploadFileInfo });
        actions$ = hot('-a---', { a: action });
        const response = cold('-a|', { a: questions });
        const expected = cold('--b', { b: completion });
        questionService.getQuestionsForBulkUpload = jest.fn(() => response);
        expect(effects.loadBulkUploadPublishedQuestions$).toBeObservable(expected);
    });

    // addBulkQuestions
    it('addBulkQuestions', () => {
        const bulkUpload = new BulkUpload();
        const action = new BulkActions.AddBulkQuestions({ bulkUpload });
        actions$ = hot('--a-', { a: action });
        const expected = cold('--#');
        expect(effects.addBulkQuestions$).toBeObservable(expected);
    });


    // updateBulkUpload
    it('updateBulkUpload', () => {
        const action = new BulkActions.UpdateBulkUpload({ bulkUploadFileInfo });
        actions$ = hot('--a-', { a: action });
        const expected = cold('--#');
        expect(effects.updateBulkUpload$).toBeObservable(expected);
    });

    // loadBulkUploadUnpublishedQuestions
    it('loadBulkUploadUnpublishedQuestions', () => {
        const questions: Question[] = testData.questions.unpublished;
        const completion = new BulkActions.LoadBulkUploadUnpublishedQuestionsSuccess(questions);
        const action = new BulkActions.LoadBulkUploadUnpublishedQuestions({ bulkUploadFileInfo });
        actions$ = hot('-a---', { a: action });
        const response = cold('-a|', { a: questions });
        const expected = cold('--b', { b: completion });
        questionService.getQuestionsForBulkUpload = jest.fn(() => response);
        expect(effects.loadBulkUploadUnpublishedQuestions$).toBeObservable(expected);
    });

    // loadBulkUploadFileUrl
    it('loadBulkUploadFileUrl', () => {
        const url = 'https://firebasestorage.googleapis.com/b/bucket/o/images%20stars.jpg';
        const completion = new BulkActions.LoadBulkUploadFileUrlSuccess(url);
        const action = new BulkActions.LoadBulkUploadFileUrl({ bulkUploadFileInfo });
        actions$ = hot('-a---', { a: action });
        const response = cold('-a|', { a: url });
        const expected = cold('--b', { b: completion });
        bulkService.getFileByBulkUploadFileUrl = jest.fn(() => response);
        expect(effects.loadBulkUploadFileUrl$).toBeObservable(expected);
    });


    // archiveUserBulkUpload
    it('archiveUserBulkUpload', () => {

        const completion = new BulkActions.ArchiveBulkUploadSuccess();
        const action = new BulkActions.ArchiveBulkUpload({ archiveArray: [bulkUploadFileInfo], user });
        actions$ = hot('-a---', { a: action });
        const response = cold('-a|', { a: null });
        const expected = cold('--b', { b: completion });
        bulkService.archiveBulkUpload = jest.fn(() => response);
        expect(effects.archiveUserBulkUpload$).toBeObservable(expected);
    });


    // getBulkUpload
    it('getBulkUpload', () => {
        const bulkId = '25145895252_bulk_id';
        const completion = new BulkActions.LoadBulkUploadFileSuccess(bulkUploadFileInfo);
        const action = new BulkActions.LoadBulkUploadFile({ bulkId });
        actions$ = hot('-a---', { a: action });
        const response = cold('-a|', { a: bulkUploadFileInfo });
        const expected = cold('--b', { b: completion });
        bulkService.getBulkUploadFile = jest.fn(() => response);
        expect(effects.getBulkUpload$).toBeObservable(expected);
    });

});






