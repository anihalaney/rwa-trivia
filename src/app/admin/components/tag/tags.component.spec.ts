import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { By }              from '@angular/platform-browser';
import { DebugElement }    from '@angular/core';
import { MaterialModule } from '@angular/material';
import { Store } from '@ngrx/store';

import { MockStore } from '../../../core/store/mock-store';
import { TagsComponent } from './tags.component';

describe('TagsComponent', () => {

  let comp: TagsComponent;
  let fixture: ComponentFixture<TagsComponent>;
  let de: DebugElement;
  let _titleEl: HTMLElement;
  let _tagListEl: HTMLElement;
  let _store: any;  // MockStore<{tags: string[]}>;

  let tagList: string[] = [
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
        MaterialModule
      ],
      providers:[
        {provide:Store, useValue: new MockStore({tags: []})}
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TagsComponent);

    //get the injected instances
    _store = fixture.debugElement.injector.get(Store);
    
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
    _store.next({tags: tagList});

    fixture.detectChanges();
    expect(_tagListEl.childElementCount).toEqual(tagList.length);
  });

  it('Tag List Contains', () => {
    _store.next({tags: tagList});

    fixture.detectChanges();
    tagList.forEach(t =>{
      expect(_tagListEl.textContent).toContain(t);
    })
  });

});
