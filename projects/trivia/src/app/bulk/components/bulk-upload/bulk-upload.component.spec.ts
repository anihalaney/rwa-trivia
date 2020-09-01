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
describe('BulkUploadComponent', () => {

  let component: BulkUploadComponent;
  let fixture: ComponentFixture<BulkUploadComponent>;
  let user: User;
  let mockStore: MockStore<AppState>;
  let mockCoreSelector: MemoizedSelector<AppState, Partial<CoreState>>;
  let mockCategorySelector: MemoizedSelector<any, {}>;

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
    mockCoreSelector = mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {});
    mockCategorySelector = mockStore.overrideSelector(categoryDictionary, {});
    component = fixture.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
