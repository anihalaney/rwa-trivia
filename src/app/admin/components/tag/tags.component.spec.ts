import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { By }              from '@angular/platform-browser';
import { DebugElement }    from '@angular/core';
import { MaterialModule } from '@angular/material';

import { StoreModule, Store } from '@ngrx/store';

import { TagsComponent } from './tags.component';
import { AppStore, default as reducer } from '../../../core/store/app-store';
import { TagActions } from '../../../core/store/actions';

describe('TagsComponent', () => {

  let comp: TagsComponent;
  let fixture: ComponentFixture<TagsComponent>;
  let de: DebugElement;
  let _titleEl: HTMLElement;
  let _tagListEl: HTMLElement;
  let _store: Store<AppStore>;
  let _tagActions: TagActions;

  let tags: string[] = [
    "Typescript",
    "Angular",
    "ngrx",
    "RxJS",
    "Redux",
    "Firebase"
  ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TagsComponent ], // declare the test component
      imports: [
        //Material
        MaterialModule,

        //store
        StoreModule.provideStore(reducer),
      ],
      providers: [ TagActions ]
    }).compileComponents();

    fixture = TestBed.createComponent(TagsComponent);

    //get the injected instances
    _store = fixture.debugElement.injector.get(Store);
    _tagActions = fixture.debugElement.injector.get(TagActions);
    
    comp = fixture.componentInstance; // Component test instance

    // query for the title <h1> by CSS element selector
    de = fixture.debugElement.query(By.css('md-card-title'));
    _titleEl = de.nativeElement;

    _tagListEl = fixture.debugElement.query(By.css('md-list')).nativeElement;
  }));

  it('Display Tags title', () => {
    fixture.detectChanges();
    expect(_titleEl.textContent).toContain("Tags");
  });

  it('Tag Count', () => {
    _store.dispatch(_tagActions.loadTagsSuccess(tags));

    fixture.detectChanges();
    expect(_tagListEl.childElementCount).toEqual(tags.length);
  });

  it('Tag List Contains', () => {
    _store.dispatch(_tagActions.loadTagsSuccess(tags));

    fixture.detectChanges();
    tags.forEach(t =>{
      expect(_tagListEl.textContent).toContain(t);
    })
  });

});

