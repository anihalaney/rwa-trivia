import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { By }              from '@angular/platform-browser';
import { DebugElement }    from '@angular/core';
import { SharedMaterialModule } from '../../../shared/shared-material.module';
import { Store } from '@ngrx/store';

import { TEST_DATA } from '../../../testing/test.data';
import { MockStore } from '../../../testing/mock-store';
import { CategoriesComponent } from './categories.component';
import { Category }     from '../../../model';

describe('Component: CategoriesComponent', () => {

  let comp: CategoriesComponent;
  let fixture: ComponentFixture<CategoriesComponent>;
  let de: DebugElement;
  let _titleEl: HTMLElement;
  let _categoryListEl: HTMLElement;
  let _store: any;

  let categoryList: Category[] = TEST_DATA.categories;
  //Define intial state and test state
  let _initialState = {categories: []};
  let _testState = {categories: categoryList};

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CategoriesComponent ], // declare the test component
      imports: [
        //Material
        SharedMaterialModule
      ],
      providers:[
        {provide:Store, useValue: new MockStore(_initialState)}
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CategoriesComponent);

    //get the injected instances
    _store = fixture.debugElement.injector.get(Store);
    
    comp = fixture.componentInstance; // Component test instance

    // query for the title by CSS element selector
    de = fixture.debugElement.query(By.css('mat-card-title'));
    _titleEl = de.nativeElement;

    _categoryListEl = fixture.debugElement.query(By.css('mat-list')).nativeElement;
  }));

  it('Display Categories title', () => {
    fixture.detectChanges();
    expect(_titleEl.textContent).toContain("Categories");
  });

  it('Category Count', () => {
    _store.next(_testState);

    fixture.detectChanges();
    expect(_categoryListEl.childElementCount).toEqual(categoryList.length);
  });

  it('Categories List Contains', () => {
    _store.next(_testState);

    fixture.detectChanges();
    categoryList.forEach(cat =>{
      expect(_categoryListEl.textContent).toContain(cat.categoryName);
    })
  });

});
