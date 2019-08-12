import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectCategoryTagComponent } from './select-category-tag.component';

describe('SelectCategoryTagComponent', () => {
  let component: SelectCategoryTagComponent;
  let fixture: ComponentFixture<SelectCategoryTagComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectCategoryTagComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectCategoryTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
