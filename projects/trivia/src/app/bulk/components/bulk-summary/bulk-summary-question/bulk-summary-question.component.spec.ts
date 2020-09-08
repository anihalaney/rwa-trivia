import { BulkSummaryQuestionComponent } from './bulk-summary-question.component';
import { ComponentFixture, async, TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { AppState, appState } from '../../../../store';
import { NO_ERRORS_SCHEMA } from '@angular/compiler/src/core';
import { CoreState, categoryDictionary, ActionWithPayload, QuestionActions } from 'shared-library/core/store';
import { Store, MemoizedSelector } from '@ngrx/store';
import { testData } from 'test/data';
import { User, BulkUploadFileInfo, Question } from 'shared-library/shared/model';
import { Utils, WindowRef } from 'shared-library/core/services';
import { MatSnackBarModule } from '@angular/material';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { BulkActionTypes } from './../../../../bulk/store/actions';
import { bulkState, BulkState } from './../../../store';
import { CdkTableModule } from '@angular/cdk/table';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { RouterTestingModule } from '@angular/router/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('BulkSummaryQuestionComponent', () => {

  let component: BulkSummaryQuestionComponent;
  let fixture: ComponentFixture<BulkSummaryQuestionComponent>;
  const user: User = testData.userList[0];
  let mockStore: MockStore<AppState>;
  let mockCoreSelector: MemoizedSelector<AppState, Partial<CoreState>>;
  let mockCategorySelector: MemoizedSelector<any, {}>;
  let spy: any;
  let router: Router;

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
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ bulkid: 'yP7sLu5TmYRUO9YT4tWrYLAqxSz1' })
          }
        },
        Utils,
        WindowRef,
        QuestionActions,
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
    router = TestBed.get(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('Verify when component load store should emit categories', () => {
    const categoriesTestData = testData.categories.categories;
    mockCoreSelector.setResult({ categories: categoriesTestData });
    mockStore.refreshState();
    component.categoriesObs.subscribe(categories => {
      expect(categories).toBe(categoriesTestData);
    });

  });
  it('Verify when component load store should emit tags', () => {
    const tagsTestData = testData.tagList;
    mockCoreSelector.setResult({ tags: tagsTestData });
    mockStore.refreshState();
    component.tagsObs.subscribe(tags => {
      expect(tags).toBe(tagsTestData);
    });
  });

  it('Verify it should show message on snackbar when store emit updateQuestion status is UPDATE ', () => {
    component.snackBar.open = jest.fn();
    mockCoreSelector.setResult({ updateQuestion: 'UPDATE' });
    mockStore.refreshState();
    expect(component.snackBar.open).toHaveBeenCalledTimes(1);
  });

  it('Verify it should show message on snackbar when store emit updateQuestion status is not UPDATE ', () => {
    component.snackBar.open = jest.fn();
    mockCoreSelector.setResult({ updateQuestion: 'Create' });
    mockStore.refreshState();
    expect(component.snackBar.open).not.toHaveBeenCalledTimes(1);
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


  it('Verify when component load store should bulkUploadPublishedQuestions and set to publishedQuestions', () => {

    const bulkQuestions = testData.questions.published;
    mockStore.overrideSelector<AppState, Partial<BulkState>>(bulkState, {
      bulkUploadPublishedQuestions: bulkQuestions
    });
    mockStore.refreshState();
    expect(component.publishedCount).toBe(7);
    expect(component.publishedQuestions).toBe(bulkQuestions);
  });

  it('Verify when component load store should bulkUploadPublishedQuestions and set to publishedQuestions', () => {

    const bulkQuestions = testData.questions.unpublished;
    mockStore.overrideSelector<AppState, Partial<BulkState>>(bulkState, {
      bulkUploadUnpublishedQuestions: bulkQuestions
    });
    mockStore.refreshState();
    expect(component.unPublishedCount).toBe(4);
    expect(component.unPublishedQuestions).toBe(bulkQuestions);
  });

  it('Verify when call downloadFile it should dispatch load bulk upload file url action', () => {
    const bulkUploadFileInfo = new BulkUploadFileInfo();
    component.bulkUploadFileInfo = bulkUploadFileInfo;
    spy.and.callFake((action: ActionWithPayload<string>) => {
      expect(action.type).toEqual(BulkActionTypes.LOAD_BULK_UPLOAD_FILE_URL);
      expect(action.payload).toEqual({ bulkUploadFileInfo });
    });
    component.downloadFile();
    expect(mockStore.dispatch).toHaveBeenCalled();
  });

  it('Verify call navigate it should redirect to /bulk when user is not admin', () => {
    const navigateSpy = spyOn(router, 'navigate');
    component.navigation();
    expect(navigateSpy).toHaveBeenCalledWith(['/bulk']);

  });

  it('Verify call navigate it should redirect to admin/bulk when user is admin', () => {
    component.isAdminUrl = true;
    const navigateSpy = spyOn(router, 'navigate');
    component.navigation();
    expect(navigateSpy).toHaveBeenCalledWith(['/admin/bulk']);

  });

  it('Verify call updateUnpublishedQuestions it should dispatch UPDATE_QUESTION action', () => {
    const question: Question = testData.questions.unpublished[0];
    spy.and.callFake((action: ActionWithPayload<Question>) => {
      expect(action.type).toEqual(QuestionActions.UPDATE_QUESTION);
      expect(action.payload).toEqual(question);
    });
    component.updateUnpublishedQuestions(question);
    expect(mockStore.dispatch).toHaveBeenCalled();
  });

  it('Verify ngOnInit call if route has admin then is should set isAdminUrl true', () => {
    component.router.routerState.snapshot.url = 'admin/bulk';
    component.ngOnInit();
    expect(component.isAdminUrl).toBeTruthy();
  });


  it('Verify ngOnInit call if route has not admin then is should set isAdminUrl false', () => {
    component.router.routerState.snapshot.url = 'bulk';
    component.ngOnInit();
    expect(component.isAdminUrl).toBeFalsy();
  });


  it('Category dictionary should be set when store emit Category dictionary', () => {
    const categoryDict = testData.categoryDictionary;
    mockCategorySelector.setResult(categoryDict);
    mockStore.refreshState();
    component.ngOnInit();
    expect(component.categoryDict).toBe(categoryDict);
  });


  it('when found params buld id then it should dispatch LOAD_BULK_UPLOAD_FILE action', () => {
    spy.and.callFake((action: ActionWithPayload<any>) => {
      expect(action.type).toEqual(BulkActionTypes.LOAD_BULK_UPLOAD_FILE);
      expect(action.payload).toEqual({ bulkId: 'yP7sLu5TmYRUO9YT4tWrYLAqxSz1' });
    });
    component.ngOnInit();
    expect(mockStore.dispatch).toHaveBeenCalled();

  });


  it('Verify when call loadUnPublishQuestion function it should dispatch LOAD_BULK_UPLOAD_PUBLISHED_QUESTIONS action', () => {
    const bulkUploadFileInfo = new BulkUploadFileInfo();
    component.loadPublishQuestion(bulkUploadFileInfo);
    expect(mockStore.dispatch).toHaveBeenCalled();

  });

  it('Verify when call loadUnPublishQuestion function it should dispatch LOAD_BULK_UPLOAD_UNPUBLISHED_QUESTIONS action', () => {

    spy.and.callFake((action: ActionWithPayload<any>) => {
      expect(action.type).toEqual(BulkActionTypes.LOAD_BULK_UPLOAD_UNPUBLISHED_QUESTIONS);
    });

    const bulkUploadFileInfo = new BulkUploadFileInfo();
    component.loadUnPublishQuestion(bulkUploadFileInfo);
    expect(mockStore.dispatch).toHaveBeenCalled();

  });

  it('Verify when call loadUnPublishQuestion function it should call loadPublishQuestion and loadUnPublishQuestion', () => {
    const spyOnLoadPublishQuestion = spyOn(component, 'loadPublishQuestion');
    const loadUnPublishQuestion = spyOn(component, 'loadUnPublishQuestion');
    const bulkUploadFileInfo = new BulkUploadFileInfo();
    component.loadPublishQuestion(bulkUploadFileInfo);
    bulkUploadFileInfo.fileName = 'fileName';
    component.bulkUploadFileInfo = bulkUploadFileInfo;
    mockStore.overrideSelector<AppState, Partial<BulkState>>(bulkState, {
      bulkUploadFileInfo: bulkUploadFileInfo
    });
    mockStore.refreshState();
    expect(spyOnLoadPublishQuestion).toHaveBeenCalled();
    expect(loadUnPublishQuestion).toHaveBeenCalled();
  });

});
