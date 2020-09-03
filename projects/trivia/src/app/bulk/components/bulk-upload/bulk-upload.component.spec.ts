import { BulkUploadComponent } from './bulk-upload.component';
import { ComponentFixture, async, TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { AppState, appState, getTags, getCategories } from '../../../store';
import { NO_ERRORS_SCHEMA } from '@angular/compiler/src/core';
import { CoreState, categoryDictionary } from 'shared-library/core/store';
import { Store, MemoizedSelector } from '@ngrx/store';
import { testData } from 'test/data';
import { User } from 'shared-library/shared/model';
import { Utils, WindowRef } from 'shared-library/core/services';
import { MatSnackBarModule, MatDialogModule, MatAutocompleteModule } from '@angular/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Papa } from 'ngx-papaparse';
import cloneDeep from 'lodash/cloneDeep';

describe('BulkUploadComponent', () => {

  let component: BulkUploadComponent;
  let fixture: ComponentFixture<BulkUploadComponent>;
  const user: User = testData.userList[0];
  let mockStore: MockStore<AppState>;
  let mockCoreSelector: MemoizedSelector<AppState, Partial<CoreState>>;
  let mockCategorySelector: MemoizedSelector<any, {}>;
  const applicationSettings: any[] = [];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BulkUploadComponent],
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
            }
          ]
        }),
        Utils,
        WindowRef,
        Papa
      ],
      imports: [MatAutocompleteModule, MatSnackBarModule, ReactiveFormsModule, FormsModule]
    });

  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkUploadComponent);
    mockStore = TestBed.get(Store);
    mockCoreSelector = mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, { user });
    mockCategorySelector = mockStore.overrideSelector(categoryDictionary, {});
    component = fixture.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('Verify that categories after store emit by store', () => {
    const categories = testData.categories.categories;
    mockCoreSelector.setResult({ categories: categories });
    mockStore.refreshState();
    fixture.detectChanges();
    component.ngOnInit();
    expect(component.categories).toBe(categories);
  });

  it('verify that tags after value is emit by store', () => {
    mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {
      tags: testData.tagList
    });
    mockStore.refreshState();
    fixture.detectChanges();
    expect(component.tags).toEqual(testData.tagList);
  });

  it('verify user after value is emit by store', () => {
    const resultUser = testData.userList[0];
    component.ngOnInit();
    expect(component.user).toEqual(resultUser);
  });

  it('verify that applicationSettings should set after value is emit by store', () => {
    applicationSettings.push(testData.applicationSettings);
    mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {
      applicationSettings: applicationSettings
    });
    mockStore.refreshState();
    component.ngOnInit();
    expect(component.applicationSettings).toBe(applicationSettings[0]);
  });
  // value change event not called
  it('on call addTag function it should insert tag in enteredTags', () => {
    component.ngOnInit();
    component.uploadFormGroup.get('tagControl').setValue('angraular');

  });

  it(`call to filter function it should should return the matched`, () => {
    component.tags = testData.tagList;
    const filteredTag = component.filter('Java');
    expect(filteredTag).toEqual(['Java', 'JavaScript']);
  });

  it(`onFileChange call it should set value in csvFile and should call getLoadCallback functions`, () => {
    component.ngOnInit();
    const mockFile = new File([''], 'filename', { type: 'text/csv' });
    const mockEvt = { target: { files: [mockFile] } };
    spyOn(component, 'getLoadCallback').and.returnValue(() => { });
    component.onFileChange(mockEvt);
    const csvFileValue = component.uploadFormGroup.get('csvFile').value;
    expect(csvFileValue).not.toBeNull();
    expect(component.getLoadCallback).toHaveBeenCalled();
  });



});
