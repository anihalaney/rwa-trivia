import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { By }              from '@angular/platform-browser';
import { DebugElement }    from '@angular/core';
import { MaterialModule } from '@angular/material';
import { Store } from '@ngrx/store';

import { MockStore } from '../../../core/store/mock-store';
import { CategoriesComponent } from './categories.component';
import { Category }     from '../../../model';

describe('CategoriesComponent', () => {

  let comp: CategoriesComponent;
  let fixture: ComponentFixture<CategoriesComponent>;
  let de: DebugElement;
  let _titleEl: HTMLElement;
  let _categoryListEl: HTMLElement;
  let _store: any;

  let categoryList: Category[] = [
    {"id": 1, "categoryName": "Special"},
    {"id": 2, "categoryName": "Programming"},
    {"id": 3, "categoryName": "Architecture"}
  ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CategoriesComponent ], // declare the test component
      imports: [
        //Material
        MaterialModule
      ],
      providers:[
        {provide:Store, useValue: new MockStore({categories: []})}
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CategoriesComponent);

    //get the injected instances
    _store = fixture.debugElement.injector.get(Store);
    
    comp = fixture.componentInstance; // Component test instance

    // query for the title by CSS element selector
    de = fixture.debugElement.query(By.css('md-card-title'));
    _titleEl = de.nativeElement;

    _categoryListEl = fixture.debugElement.query(By.css('md-list')).nativeElement;
  }));

  it('Display Categories title', () => {
    fixture.detectChanges();
    expect(_titleEl.textContent).toContain("Categories");
  });

  it('Category Count', () => {
    _store.next({categories: categoryList});

    fixture.detectChanges();
    expect(_categoryListEl.childElementCount).toEqual(categoryList.length);
  });

  it('Categories List Contains', () => {
    _store.next({categories: categoryList});

    fixture.detectChanges();
    categoryList.forEach(cat =>{
      expect(_categoryListEl.textContent).toContain(cat.categoryName);
    })
  });

});
