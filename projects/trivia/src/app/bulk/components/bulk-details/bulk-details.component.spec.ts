import { BulkDetailsComponent } from './bulk-details.component';
import { ComponentFixture, async, TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { AppState, appState, getTags, getCategories } from '../../../store';
import { NO_ERRORS_SCHEMA } from '@angular/compiler/src/core';
import { CoreState, categoryDictionary } from 'shared-library/core/store';
import { Store, MemoizedSelector } from '@ngrx/store';
import { testData } from 'test/data';
import { User } from 'shared-library/shared/model';

describe('BulkDetailsComponent', () => {

  let component: BulkDetailsComponent;
  let fixture: ComponentFixture<BulkDetailsComponent>;
  let user: User;
  let mockStore: MockStore<AppState>;
  let mockCoreSelector: MemoizedSelector<AppState, Partial<CoreState>>;
  let mockCategorySelector: MemoizedSelector<any, {}>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BulkDetailsComponent],
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
        })
      ],
      imports: []
    });

  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkDetailsComponent);
    mockStore = TestBed.get(Store);
    mockCoreSelector = mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {});
    mockCategorySelector = mockStore.overrideSelector(categoryDictionary, {});
    component = fixture.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Verify that user information should be set successfully', () => {
    user = { ...testData.userList[0] };
    mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {
      user: user
    });
    mockStore.refreshState();
    fixture.detectChanges();
    expect(component.user).toEqual(user);
  });

  it('Verify that tag should set', () => {
    const tags = testData.tagList;
    getTags.setResult(tags);
    mockStore.refreshState();
    fixture.detectChanges();
    component.ngOnInit();
    component.tagsObs.subscribe(tagList => {
      expect(tagList).toBe(tags);
    });
  });

  it('Verify that categoryList should set', () => {
    const categoryList = testData.categoryList;
    getCategories.setResult(categoryList);
    mockStore.refreshState();
    fixture.detectChanges();
    component.ngOnInit();
    component.categoriesObs.subscribe(categories => {
      expect(categories).toBe(categoryList);
    });
  });

  it('Category dictionary should be set when store emit Category dictionary', () => {
    const categoryDict = testData.categoryDictionary;
    mockCategorySelector.setResult(categoryDict);
    mockStore.refreshState();
    component.categoryDictObs.subscribe(categoryDic => expect(categoryDic).toBe(categoryDict));

  });

  it('On call ngOnChanges it should set totalCount', () => {
    component.parsedQuestions = testData.questions.unpublished;
    component.ngOnChanges();
    expect(component.totalCount).toBe(4);
  });


});
