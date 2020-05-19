import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionsTableComponent } from './questions-table.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { StoreModule, MemoizedSelector, Store } from '@ngrx/store';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { coreState, CoreState, UserActions, ActionWithPayload } from 'shared-library/core/store';
import { Utils, WindowRef } from 'shared-library/core/services';
import { MatSnackBarModule, MatSelectModule, MatPaginatorModule, MatTableModule, MatCheckboxModule } from '@angular/material';
import { testData } from 'test/data';
import { NO_ERRORS_SCHEMA } from '@angular/compiler/src/core';
import { CdkColumnDef, CdkRowDef, CdkHeaderRowDef } from '@angular/cdk/table';

describe('QuestionsTableComponent', () => {
  let component: QuestionsTableComponent;
  let fixture: ComponentFixture<QuestionsTableComponent>;
  let mockStore: MockStore<CoreState>;
  let spy: any;
  let mockCoreSelector: MemoizedSelector<CoreState, Partial<CoreState>>;



  beforeEach(async(() => {

    TestBed.configureTestingModule({

      imports: [ReactiveFormsModule, FormsModule, StoreModule.forRoot({}), MatSnackBarModule,
        MatSelectModule, MatPaginatorModule, MatCheckboxModule],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [provideMockStore({
        initialState: {},
        selectors: [
          {
            selector: coreState,
            value: {}
          }
        ]
      }),
        UserActions,
        Utils,
        WindowRef],
      declarations: [QuestionsTableComponent, CdkColumnDef, CdkRowDef, CdkHeaderRowDef]
    });

    fixture = TestBed.createComponent(QuestionsTableComponent);
    mockStore = TestBed.get(Store);
    component = fixture.componentInstance;
    mockCoreSelector = mockStore.overrideSelector<CoreState, Partial<CoreState>>(coreState, {});
    spy = spyOn(mockStore, 'dispatch');
    fixture.detectChanges();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
