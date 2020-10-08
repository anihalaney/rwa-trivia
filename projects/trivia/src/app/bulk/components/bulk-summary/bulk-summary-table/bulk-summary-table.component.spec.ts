import { BulkSummaryTableComponent } from './bulk-summary-table.component';
import { ComponentFixture, async, TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { AppState, appState } from '../../../../store';
import { NO_ERRORS_SCHEMA } from '@angular/compiler/src/core';
import { CoreState, categoryDictionary, ActionWithPayload } from 'shared-library/core/store';
import { Store, MemoizedSelector } from '@ngrx/store';
import { testData } from 'test/data';
import { User, BulkUploadFileInfo } from 'shared-library/shared/model';
import { BulkActionTypes } from './../../../../bulk/store/actions';
import { bulkState, BulkState } from './../../../store';
import { CdkTableModule } from '@angular/cdk/table';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';


describe('BulkSummaryTableComponent', () => {

  let component: BulkSummaryTableComponent;
  let fixture: ComponentFixture<BulkSummaryTableComponent>;
  const user: User = testData.userList[0];
  let mockStore: MockStore<AppState>;
  let mockCoreSelector: MemoizedSelector<AppState, Partial<CoreState>>;
  let mockCategorySelector: MemoizedSelector<any, {}>;
  let spy: any;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BulkSummaryTableComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        provideMockStore({
          initialState: {},
          selectors: [
            {
              selector: appState.coreState,
              value: {
                user
              }
            },
            {
              selector: bulkState,
              value: {}
            }
          ]
        }),
      ],
      imports: [CdkTableModule, RouterTestingModule]
    });

  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkSummaryTableComponent);
    mockStore = TestBed.get(Store);
    mockCoreSelector = mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, { user });
    mockCategorySelector = mockStore.overrideSelector(categoryDictionary, {});
    component = fixture.debugElement.componentInstance;
    spy = spyOn(mockStore, 'dispatch');
    router = TestBed.get(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('Verify when store emit bulkUploadFileUrl it should dispatch load buld upload file url success event', () => {

    spy.and.callFake((action: ActionWithPayload<string>) => {
      expect(action.type).toEqual(BulkActionTypes.LOAD_BULK_UPLOAD_FILE_URL_SUCCESS);
      expect(action.payload).toEqual(undefined);
    });
    mockStore.overrideSelector<AppState, Partial<BulkState>>(bulkState, {
      bulkUploadFileUrl: 'http://www.firebase-file-url.com'
    });
    mockStore.refreshState();
    expect(mockStore.dispatch).toHaveBeenCalled();
  });

  it('Verify when store emit bulkUploadArchiveStatus ARCHIVED status it should save archive list', () => {

    spy.and.callFake((action: ActionWithPayload<string>) => {
      expect(action.type).toEqual(BulkActionTypes.SAVE_ARCHIVE_LIST);
      expect(action.payload).toEqual([]);
    });
    mockStore.overrideSelector<AppState, Partial<BulkState>>(bulkState, {
      bulkUploadArchiveStatus: 'ARCHIVED'
    });
    mockStore.refreshState();
    expect(mockStore.dispatch).toHaveBeenCalled();
  });

  it('Verify when store emit bulkUploadFileInfo list it should set archivedArray', () => {

    const bulkUploadFileInfo = new BulkUploadFileInfo();
    mockStore.overrideSelector<AppState, Partial<BulkState>>(bulkState, {
      getArchiveList: [bulkUploadFileInfo]
    });
    mockStore.refreshState();
    expect(component.archivedArray).toEqual([bulkUploadFileInfo]);
  });


  it('Verify when store emit null bulkUploadFileInfo list it should set archivedArray empty array', () => {
    mockStore.overrideSelector<AppState, Partial<BulkState>>(bulkState, {
      getArchiveList: []
    });
    mockStore.refreshState();
    expect(component.archivedArray).toEqual([]);
  });

  it('Verify on call ngOnInit it should call loadBulkSummaryData', () => {
    const spyOnLoadBulkSummaryData = spyOn(component, 'loadBulkSummaryData');
    component.bulkSummaryDetailPath = 'path';
    component.showSummaryTable = true;
    component.ngOnInit();
    expect(spyOnLoadBulkSummaryData).toHaveBeenCalledWith();
  });

  it('Verify on call checkArchieved it should return true if found bulkUploadId', () => {
    const bulkUploadFileInfo = new BulkUploadFileInfo();
    const bulkUploadId = 'cce85s8e52x4ex';
    bulkUploadFileInfo.id = bulkUploadId;
    mockStore.overrideSelector<AppState, Partial<BulkState>>(bulkState, {
      getArchiveList: [bulkUploadFileInfo]
    });
    mockStore.refreshState();
    const isArchivedExist = component.checkArchieved(bulkUploadId);
    expect(isArchivedExist).toBeTruthy();
  });

  it('Verify on call checkArchieved it should return true if found bulkUploadId', () => {
    const bulkUploadFileInfo = new BulkUploadFileInfo();
    const bulkUploadId = 'cce85s8e52x4ex';
    bulkUploadFileInfo.id = bulkUploadId;
    mockStore.overrideSelector<AppState, Partial<BulkState>>(bulkState, {
      getArchiveList: [bulkUploadFileInfo]
    });
    mockStore.refreshState();
    const isArchivedExist = component.checkArchieved('');
    expect(isArchivedExist).toBeFalsy();
  });

  it('verify checkedRow() if bulk uploaded file exist in bulkUploadFileInfo then remove it', () => {

    const bulkUploadFileInfo = new BulkUploadFileInfo();
    const bulkUploadId = 'cce85s8e52x4ex';

    spy.and.callFake((action: ActionWithPayload<string>) => {
      expect(action.type).toEqual(BulkActionTypes.SAVE_ARCHIVE_LIST);
    });

    bulkUploadFileInfo.id = bulkUploadId;
    mockStore.overrideSelector<AppState, Partial<BulkState>>(bulkState, {
      getArchiveList: [bulkUploadFileInfo]
    });
    mockStore.refreshState();
    component.checkedRow(bulkUploadFileInfo);
    expect(component.archivedArray).toEqual([]);
    expect(mockStore.dispatch).toHaveBeenCalled();
  });

  it('verify on checkedRow() if bulk uploaded file not added then it should add bulkUploadFileInfo', () => {

    const bulkUploadFileInfo = new BulkUploadFileInfo();
    const bulkUploadFileInfoObj = new BulkUploadFileInfo();

    const bulkUploadId = 'cce85s8e52x4ex';

    spy.and.callFake((action: ActionWithPayload<string>) => {
      expect(action.type).toEqual(BulkActionTypes.SAVE_ARCHIVE_LIST);
    });

    bulkUploadFileInfo.id = bulkUploadId;
    bulkUploadFileInfoObj.id = 'jsieDLe582s42';
    mockStore.overrideSelector<AppState, Partial<BulkState>>(bulkState, {
      getArchiveList: [bulkUploadFileInfo]
    });
    mockStore.refreshState();

    component.checkedRow(bulkUploadFileInfoObj);
    expect(component.archivedArray.length).toBe(2);
    expect(mockStore.dispatch).toHaveBeenCalled();

  });

  it('Verify when call downloadFile it should dispatch load bulk upload file url action', () => {
    const bulkUploadFileInfo = new BulkUploadFileInfo();
    component.bulkUploadFileInfo = bulkUploadFileInfo;
    spy.and.callFake((action: ActionWithPayload<string>) => {
      expect(action.type).toEqual(BulkActionTypes.LOAD_BULK_UPLOAD_FILE_URL);
      expect(action.payload).toEqual({ bulkUploadFileInfo });
    });
    component.downloadFile(bulkUploadFileInfo);
    expect(mockStore.dispatch).toHaveBeenCalled();
  });

  it('Verify call getBulkUploadQuestions it should redirect to /bulk/detail when user is not admin', () => {
    const navigateSpy = spyOn(router, 'navigate');
    const bulkUploadFileInfo = new BulkUploadFileInfo();
    component.bulkUploadFileInfo = bulkUploadFileInfo;
    const bulkUploadId = 'cce85s8e52x4ex';
    bulkUploadFileInfo.id = bulkUploadId;
    component.getBulkUploadQuestions(bulkUploadFileInfo);
    expect(navigateSpy).toHaveBeenCalledWith(['/bulk/detail', 'cce85s8e52x4ex']);

  });

  it('Verify call getBulkUploadQuestions it should redirect to /admin/bulk/detail when user is admin', () => {
    component.isAdminUrl = true;
    const navigateSpy = spyOn(router, 'navigate');
    const bulkUploadFileInfo = new BulkUploadFileInfo();
    component.bulkUploadFileInfo = bulkUploadFileInfo;
    const bulkUploadId = 'cce85s8e52x4ex';
    bulkUploadFileInfo.id = bulkUploadId;
    component.getBulkUploadQuestions(bulkUploadFileInfo);
    expect(navigateSpy).toHaveBeenCalledWith(['/admin/bulk/detail', 'cce85s8e52x4ex']);

  });

  it('loadBulkSummaryData it should dispatch event LOAD_BULK_UPLOAD with archive false, user is admin ', () => {

    spy.and.callFake((action: ActionWithPayload<string>) => {
      expect(action.type).toEqual(BulkActionTypes.LOAD_BULK_UPLOAD);
      expect(action.payload).toEqual({ user: user, archive: false, });
    });
    const spyOnSetPaginatorAndSort = spyOn(component, 'setPaginatorAndSort');

    const bulkUploadFileInfo = new BulkUploadFileInfo();
    const bulkUploadId = 'cce85s8e52x4ex';

    component.bulkUploadFileInfo = bulkUploadFileInfo;
    bulkUploadFileInfo.id = bulkUploadId;
    bulkUploadFileInfo.categoryId = 1;
    mockStore.overrideSelector<AppState, Partial<BulkState>>(bulkState, {
      bulkUploadFileInfos: [bulkUploadFileInfo]
    });
    mockStore.refreshState();
    component.categoryDict = testData.categoryDictionary;

    component.bulkSummaryDetailPath = '/admin/bulk';
    component.loadBulkSummaryData();
    expect(mockStore.dispatch).toHaveBeenCalled();
    expect(spyOnSetPaginatorAndSort).toHaveBeenCalled();

  });

  // tslint:disable-next-line: max-line-length
  it('loadBulkSummaryData it should dispatch event LOAD_BULK_UPLOAD with archive false when isArchiveBtnClicked is true, user is admin', () => {

    const user: User = testData.userList[0];
    component.isArchiveBtnClicked = true;
    spy.and.callFake((action: ActionWithPayload<string>) => {
      expect(action.type).toEqual(BulkActionTypes.LOAD_BULK_UPLOAD);
      expect(action.payload).toEqual({ user: user, archive: false, });
    });

    component.bulkSummaryDetailPath = '/admin/bulk';
    component.loadBulkSummaryData();
    expect(mockStore.dispatch).toHaveBeenCalled();

  });

  // tslint:disable-next-line: max-line-length
  it('loadBulkSummaryData it should dispatch event LOAD_BULK_UPLOAD with archive false when isArchiveBtnClicked is true, user is admin', () => {

    // const user: User = testData.userList[0];
    component.isArchiveBtnClicked = false;
    component.toggleValue = true;
    spy.and.callFake((action: ActionWithPayload<string>) => {
      expect(action.type).toEqual(BulkActionTypes.LOAD_BULK_UPLOAD);
      expect(action.payload).toEqual({ user: user, archive: true });
    });

    component.bulkSummaryDetailPath = '/admin/bulk';
    component.loadBulkSummaryData();
    expect(mockStore.dispatch).toHaveBeenCalled();

  });

  it('loadBulkSummaryData it should dispatch event LOAD_USER_BULK_UPLOAD with archive false, user is not admin ', () => {

    spy.and.callFake((action: ActionWithPayload<string>) => {
      expect(action.type).toEqual(BulkActionTypes.LOAD_USER_BULK_UPLOAD);
      expect(action.payload).toEqual({ user: user, archive: false, });
    });

    component.bulkSummaryDetailPath = '/bulk';
    component.loadBulkSummaryData();
    expect(mockStore.dispatch).toHaveBeenCalled();

  });

  // tslint:disable-next-line: max-line-length
  it('loadBulkSummaryData it should dispatch event LOAD_USER_BULK_UPLOAD with archive false when isArchiveBtnClicked is true, user is not admin', () => {

    const user: User = testData.userList[0];
    component.isArchiveBtnClicked = true;
    spy.and.callFake((action: ActionWithPayload<string>) => {
      expect(action.type).toEqual(BulkActionTypes.LOAD_USER_BULK_UPLOAD);
      expect(action.payload).toEqual({ user: user, archive: false, });
    });

    component.bulkSummaryDetailPath = '/bulk';
    component.loadBulkSummaryData();
    expect(mockStore.dispatch).toHaveBeenCalled();

  });

  // tslint:disable-next-line: max-line-length
  it('loadBulkSummaryData it should dispatch event LOAD_USER_BULK_UPLOAD with archive false when isArchiveBtnClicked is true, user is admin', () => {

    // const user: User = testData.userList[0];
    component.isArchiveBtnClicked = false;
    component.toggleValue = true;
    spy.and.callFake((action: ActionWithPayload<string>) => {
      expect(action.type).toEqual(BulkActionTypes.LOAD_USER_BULK_UPLOAD);
      expect(action.payload).toEqual({ user: user, archive: true });
    });

    component.bulkSummaryDetailPath = '/bulk';
    component.loadBulkSummaryData();
    expect(mockStore.dispatch).toHaveBeenCalled();

  });

  it('on call ngOnChanges if admin is login then then it should dispatch LOAD_USER_BULK_UPLOAD action', () => {
    component.isArchiveBtnClicked = true;
    component.toggleValue = true;
    const bulkUploadFileInfo = new BulkUploadFileInfo();
    const bulkUploadId = 'cce85s8e52x4ex';
    bulkUploadFileInfo.id = bulkUploadId;
    bulkUploadFileInfo.categoryId = 1;
    component.dispatchArchiveBulkUpload = jest.fn();
    component.archivedArray = [bulkUploadFileInfo];
    spy.and.callFake((action: ActionWithPayload<any>) => {
      expect(action.type).toEqual(BulkActionTypes.LOAD_USER_BULK_UPLOAD);
      expect(action.payload).toEqual({ user: user, archive: true });
    });

    component.ngOnChanges({
      toggleValue: {
        currentValue: true,
        firstChange: true,
        previousValue: false,
        isFirstChange: undefined
      }
    });
    expect(mockStore.dispatch).toHaveBeenCalled();
  });

  it('on call ngOnChanges if admin is login then then it should dispatch LOAD_BULK_UPLOAD action', () => {
    component.isArchiveBtnClicked = true;
    component.toggleValue = true;
    component.isAdminUrl = true;
    const bulkUploadFileInfo = new BulkUploadFileInfo();
    const bulkUploadId = 'cce85s8e52x4ex';
    bulkUploadFileInfo.id = bulkUploadId;
    bulkUploadFileInfo.categoryId = 1;
    component.dispatchArchiveBulkUpload = jest.fn();
    component.archivedArray = [bulkUploadFileInfo];
    spy.and.callFake((action: ActionWithPayload<any>) => {
      expect(action.type).toEqual(BulkActionTypes.LOAD_BULK_UPLOAD);
      expect(action.payload).toEqual({ user: user, archive: true });
    });

    component.ngOnChanges({
      toggleValue: {
        currentValue: true,
        firstChange: true,
        previousValue: false,
        isFirstChange: undefined
      }
    });
    expect(mockStore.dispatch).toHaveBeenCalled();
  });

  it(`dfd`, () => {
    const bulkUploadFileInfo = new BulkUploadFileInfo();
    const bulkUploadId = 'cce85s8e52x4ex';
    bulkUploadFileInfo.id = bulkUploadId;
    bulkUploadFileInfo.categoryId = 1;
    component.archivedArray = [bulkUploadFileInfo];
    spy.and.callFake((action: ActionWithPayload<any>) => {
      expect(action.type).toEqual(BulkActionTypes.ARCHIVE_BULK_UPLOAD);
      expect(action.payload).toEqual({ archiveArray: [bulkUploadFileInfo], user: user });
    });
    component.dispatchArchiveBulkUpload();
    expect(mockStore.dispatch).toHaveBeenCalled();

  });

});
