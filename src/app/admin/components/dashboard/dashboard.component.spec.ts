import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { By }              from '@angular/platform-browser';
import { DebugElement, NO_ERRORS_SCHEMA }    from '@angular/core';
import { SharedMaterialModule } from '../../../shared/shared-material.module';
import { Store } from '@ngrx/store';

import { TEST_DATA } from '../../../testing/test.data';
import { MockStore } from '../../../testing/mock-store';
import { DashboardComponent } from './dashboard.component';
import { QuestionActions } from '../../../core/store/actions';

describe('Component: DashboardComponent (Admin)', () => {

  let comp: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let de: DebugElement;
  let _titleEl: HTMLElement;
  let _store: any;

  //Define intial state and test state
  let _initialState = {
                        tags: [],
                        categories: [],
                        categoryDictionary: {},
                        questions: [],
                        sampleQuestions: []
                      };

  let sampleQuestions = TEST_DATA.questions.published.slice(1,4);
  let _testState = {
                    tags: TEST_DATA.tagList,
                    categories: TEST_DATA.categories,
                    categoryDictionary: TEST_DATA.categoryDictionary,
                    questions: TEST_DATA.questions.published,
                    sampleQuestions: sampleQuestions
                  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardComponent ], // declare the test component
      imports: [
        //Material
        SharedMaterialModule
      ],
    schemas:      [ NO_ERRORS_SCHEMA ],
    providers:[
        QuestionActions,
        {provide:Store, useValue: new MockStore(_initialState)}
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);

    //get the injected instances
    _store = fixture.debugElement.injector.get(Store);
    
    comp = fixture.componentInstance; // Component test instance

    // query for the title by CSS element selector
    de = fixture.debugElement.query(By.css('mat-card-title'));
    _titleEl = de.nativeElement;
  }));

  //Unit Tests
  it('Display Title', () => {
    fixture.detectChanges();
    expect(_titleEl.textContent).toContain("rwa Stats");
  });

  it('Dashboard Counts', () => {
    _store.next(_testState);

    fixture.detectChanges();

    let tagCountEl = fixture.debugElement.query(By.css('#tag-count')).nativeElement;
    let catCountEl = fixture.debugElement.query(By.css('#category-count')).nativeElement;
    let qCountEl = fixture.debugElement.query(By.css('#question-count')).nativeElement;

    expect(tagCountEl.textContent).toEqual(TEST_DATA.tagList.length.toString());
    expect(catCountEl.textContent).toEqual(TEST_DATA.categories.length.toString());
    expect(qCountEl.textContent).toEqual(TEST_DATA.questions.published.length.toString());
  });

  //TODO: Test with questions child component

});
