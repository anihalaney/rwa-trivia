import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { QuestionAddUpdateComponent } from './question-add-update.component'
import { PreviewQuestionDialogComponent } from './preview-question-dialog/preview-question-dialog.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { StoreModule, MemoizedSelector, Store } from '@ngrx/store';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { coreState, CoreState, UserActions } from 'shared-library/core/store';
import { Utils, WindowRef } from 'shared-library/core/services';
import { MatSnackBarModule } from '@angular/material';
import { AppState } from '../../../../../../trivia/src/app/store';
import { TEST_DATA } from 'shared-library/testing/test.data';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { fromEventPattern } from 'rxjs';


describe('QuestionAddUpdateComponent', () => {
  let component: QuestionAddUpdateComponent;
  let fixture: ComponentFixture<QuestionAddUpdateComponent>;
  let mockStore: MockStore<AppState>;
  let spy: any;
  let mockCoreSelector: MemoizedSelector<CoreState, Partial<CoreState>>;
  beforeEach(async(() => {

    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [QuestionAddUpdateComponent, PreviewQuestionDialogComponent],
      imports: [ReactiveFormsModule, FormsModule, StoreModule.forRoot({}), MatSnackBarModule],
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
        WindowRef,],

    });

    fixture = TestBed.createComponent(QuestionAddUpdateComponent);
    mockStore = TestBed.get(Store);
    component = fixture.componentInstance;
    mockCoreSelector = mockStore.overrideSelector<CoreState, Partial<CoreState>>(coreState, {});
    spy = spyOn(mockStore, 'dispatch');
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});