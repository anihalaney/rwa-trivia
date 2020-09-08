import { BulkSummaryQuestionComponent } from './bulk-summary-question.component';
import { ComponentFixture, async, TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { AppState, appState } from '../../../../store';
import { NO_ERRORS_SCHEMA } from '@angular/compiler/src/core';
import { CoreState, categoryDictionary, ActionWithPayload, QuestionActions } from 'shared-library/core/store';
import { Store, MemoizedSelector } from '@ngrx/store';
import { testData } from 'test/data';
import { User, BulkUploadFileInfo } from 'shared-library/shared/model';
import { Utils, WindowRef } from 'shared-library/core/services';
import { MatSnackBarModule } from '@angular/material';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { BulkActionTypes } from './../../../../bulk/store/actions';
import { bulkState, BulkState } from './../../../store';
import { CdkTableModule } from '@angular/cdk/table';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { RouterTestingModule } from '@angular/router/testing';

describe('BulkSummaryQuestionComponent', () => {

  let component: BulkSummaryQuestionComponent;
  let fixture: ComponentFixture<BulkSummaryQuestionComponent>;
  const user: User = testData.userList[0];
  let mockStore: MockStore<AppState>;
  let mockCoreSelector: MemoizedSelector<AppState, Partial<CoreState>>;
  let mockCategorySelector: MemoizedSelector<any, {}>;
  const applicationSettings: any[] = [];
  let spy: any;

  const AngularFirestorageStub = {
    // I just mocked the function you need, if there are more, you can add them here.
    collection: (someString) => {
      // return mocked collection here
    }
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BulkSummaryQuestionComponent],
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
        QuestionActions,
        { provide: AngularFireStorage, useValue: AngularFirestorageStub }

      ],
      imports: [MatSnackBarModule, MatButtonToggleModule, CdkTableModule,
        AngularFireDatabaseModule, RouterTestingModule
      ]
    });

  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkSummaryQuestionComponent);
    mockStore = TestBed.get(Store);
    mockCoreSelector = mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, { user });
    mockCategorySelector = mockStore.overrideSelector(categoryDictionary, {});
    component = fixture.debugElement.componentInstance;
    spy = spyOn(mockStore, 'dispatch');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
