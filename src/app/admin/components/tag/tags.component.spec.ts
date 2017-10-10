import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { By }              from '@angular/platform-browser';
import { DebugElement }    from '@angular/core';
import { SharedMaterialModule } from '../../../shared/shared-material.module';
import { Store } from '@ngrx/store';

import { TEST_DATA } from '../../../testing/test.data';
import { MockStore } from '../../../testing/mock-store';
import { TagsComponent } from './tags.component';

describe('Component: TagsComponent', () => {

  let comp: TagsComponent;
  let fixture: ComponentFixture<TagsComponent>;
  let de: DebugElement;
  let _titleEl: HTMLElement;
  let _tagListEl: HTMLElement;
  let _store: any;  // MockStore<{tags: string[]}>;

  let tagList: string[] = TEST_DATA.tagList;

  //Define intial state and test state
  let _initialState = {tags: []};
  let _testState = {tags: tagList};

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TagsComponent ], // declare the test component
      imports: [
        //Material
        SharedMaterialModule
      ],
      providers:[
        { provide:Store, useValue: new MockStore(_initialState) }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TagsComponent);

    //get the injected instances
    _store = fixture.debugElement.injector.get(Store);
    
    comp = fixture.componentInstance; // Component test instance

    // query for the title by CSS element selector
    de = fixture.debugElement.query(By.css('mat-card-title'));
    _titleEl = de.nativeElement;

    _tagListEl = fixture.debugElement.query(By.css('mat-list')).nativeElement;
  }));

  it('Display Tags title', () => {
    fixture.detectChanges();
    expect(_titleEl.textContent).toContain("Tags");
  });

  it('Tag Count', () => {
    _store.next(_testState);

    fixture.detectChanges();
    expect(_tagListEl.childElementCount).toEqual(tagList.length);
  });

  it('Tag List Contains', () => {
    _store.next(_testState);

    fixture.detectChanges();
    tagList.forEach(t =>{
      expect(_tagListEl.textContent).toContain(t);
    })
  });

});
