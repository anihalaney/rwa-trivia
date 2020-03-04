import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateCategoryTagComponent } from './update-category-tag.component';

describe('UpdateCategoryTagComponent', () => {
  let component: UpdateCategoryTagComponent;
  let fixture: ComponentFixture<UpdateCategoryTagComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateCategoryTagComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateCategoryTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
