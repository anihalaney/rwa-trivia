import { BulkSummaryComponent } from './bulk-summary.component';
import { ComponentFixture, async, TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { AppState, appState } from '../../../store';
import { NO_ERRORS_SCHEMA } from '@angular/compiler/src/core';
import { CoreState, categoryDictionary, ActionWithPayload } from 'shared-library/core/store';
import { Store, MemoizedSelector } from '@ngrx/store';
import { testData } from 'test/data';
import { User, BulkUploadFileInfo } from 'shared-library/shared/model';
import { Utils, WindowRef } from 'shared-library/core/services';
import { MatSnackBarModule } from '@angular/material';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { BulkActionTypes } from '../../../bulk/store/actions';
import { bulkState, BulkState } from '../../store';

describe('BulkSummaryComponent', () => {

  let component: BulkSummaryComponent;
  let fixture: ComponentFixture<BulkSummaryComponent>;
  const user: User = testData.userList[0];
  let mockStore: MockStore<AppState>;
  let mockCoreSelector: MemoizedSelector<AppState, Partial<CoreState>>;
  let mockCategorySelector: MemoizedSelector<any, {}>;
  const applicationSettings: any[] = [];
  let spy: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BulkSummaryComponent],
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
        Utils,
        WindowRef,
      ],
      imports: [MatSnackBarModule, MatButtonToggleModule]
    });

  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkSummaryComponent);
    mockStore = TestBed.get(Store);
    mockCoreSelector = mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, { user });
    mockCategorySelector = mockStore.overrideSelector(categoryDictionary, {});
    component = fixture.debugElement.componentInstance;
    spy = spyOn(mockStore, 'dispatch');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('On call ngOnInit it should call setDefaultTitle function', () => {
    const spyOnSetDefaultTitle = spyOn(component, 'setDefaultTitle');
    component.ngOnInit();
    expect(spyOnSetDefaultTitle).toHaveBeenCalled();
  });

  it('On call tapped it should dispatch save archive toggle state event and set toggleValue value true', () => {
    spy.and.callFake((action: ActionWithPayload<string>) => {
      expect(action.type).toEqual(BulkActionTypes.SAVE_ARCHIVE_TOGGLE_STATE);
      expect(action.payload).toEqual({ 'toggle_state': true });
    });
    component.tapped(true);
    expect(component.toggleValue).toBeTruthy();
    expect(mockStore.dispatch).toHaveBeenCalled();
  });

  it('On call tapped it should dispatch save archive toggle state event and set toggleValue value false', () => {
    spy.and.callFake((action: ActionWithPayload<string>) => {
      expect(action.type).toEqual(BulkActionTypes.SAVE_ARCHIVE_TOGGLE_STATE);
      expect(action.payload).toEqual({ 'toggle_state': false });
    });
    component.tapped(false);
    expect(component.toggleValue).toBeFalsy();
    expect(mockStore.dispatch).toHaveBeenCalled();
  });

  it('On call changeTableHeading it should set bulkSummaryTitle and  showSummaryTable false', () => {
    component.changeTableHeading('Bulk Summary');
    expect(component.bulkSummaryTitle).toBe('Bulk Summary');
    expect(component.showSummaryTable).toBeFalsy();
  });

  it('On call setDefaultTitle it should set bulkSummaryTitle', () => {
    component.setDefaultTitle();
    expect(component.bulkSummaryTitle).toBe('My Bulk Upload Summary');
  });

  it('On call backToSummary it should set showSummaryTable and it should call setDefaultTitle', () => {
    const spyOnSetDefaultTitle = spyOn(component, 'setDefaultTitle');
    component.backToSummary();
    expect(component.showSummaryTable).toBeTruthy();
    expect(spyOnSetDefaultTitle).toHaveBeenCalled();
  });

  it('On call archiveData it should set isArchiveBtnClicked true', () => {
    component.archiveData();
    expect(component.isArchiveBtnClicked).toBeTruthy();
  });

  it('when component load store should emit getArchiveToggleState', () => {
    mockStore.overrideSelector<AppState, Partial<BulkState>>(bulkState, {
      getArchiveToggleState: true
    });
    mockStore.refreshState();
    fixture.detectChanges();
    expect(component.toggleValue).toBeTruthy();
  });

  it('when component load store should emit getArchiveList and set isArchive true when  getArchiveList is not empty', () => {
    const bulkUploadFileInfo = new BulkUploadFileInfo();
    mockStore.overrideSelector<AppState, Partial<BulkState>>(bulkState, {
      getArchiveList: [bulkUploadFileInfo]
    });
    mockStore.refreshState();
    fixture.detectChanges();
    expect(component.isArchive).toBeTruthy();
  });

  // tslint:disable-next-line: max-line-length
  it('when component load store should emit getArchiveList and set isArchive false and isArchiveBtnClicked when getArchiveList is empty list', () => {
    mockStore.overrideSelector<AppState, Partial<BulkState>>(bulkState, {
      getArchiveList: []
    });
    mockStore.refreshState();
    fixture.detectChanges();
    expect(component.isArchive).toBeFalsy();
    expect(component.isArchiveBtnClicked).toBeFalsy();

  });


});
