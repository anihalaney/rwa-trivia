import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { By }              from '@angular/platform-browser';
import { DebugElement, NO_ERRORS_SCHEMA }    from '@angular/core';
import { SharedMaterialModule } from '../../../shared/shared-material.module';
import { Store } from '@ngrx/store';

import { TEST_DATA } from '../../../testing/test.data';
import { MockStore } from '../../../testing/mock-store';
import { RouterLinkStubDirective } from '../../../testing/router-stubs';
import { MyQuestionsComponent } from './my-questions.component';
import { QuestionActions } from '../../../core/store/actions';

describe('Component: MyQuestionsComponent', () => {

  let comp: MyQuestionsComponent;
  let fixture: ComponentFixture<MyQuestionsComponent>;
  let de: DebugElement;
  let _titleEl: HTMLElement;
  let _store: any;

  //Define intial state and test state
  let _initialState = {
                        categoryDictionary: {},
                        userQuestions: []
                      };

  let userQuestions = TEST_DATA.questions.published.slice(1,4);
  let _testState = {
                    categoryDictionary: TEST_DATA.categoryDictionary,
                    userQuestions: userQuestions
                  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyQuestionsComponent, RouterLinkStubDirective ], // declare the test component
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

    fixture = TestBed.createComponent(MyQuestionsComponent);

    //get the injected instances
    _store = fixture.debugElement.injector.get(Store);
    
    comp = fixture.componentInstance; // Component test instance

    // query for the title by CSS element selector
    de = fixture.debugElement.query(By.css('mat-card-title'));
    _titleEl = de.nativeElement;

  }));

  //Unit Tests
  it('Display Title and Add Q Link', () => {
    fixture.detectChanges();
    expect(_titleEl.textContent).toContain("Questions");

    let deAddLink = fixture.debugElement.query(By.directive(RouterLinkStubDirective));
    let dirLink = deAddLink.injector.get(RouterLinkStubDirective) as RouterLinkStubDirective;
    expect(dirLink.linkParams[0]).toBe('add', 'Link to Add new question');
  });

  //TODO: Test with questions child component

});
