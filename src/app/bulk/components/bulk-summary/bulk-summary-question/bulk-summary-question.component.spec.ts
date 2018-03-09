import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkSummaryQuestionListComponent } from './bulk-summary-question-list.component';

describe('BulkSummaryQuestionListComponent', () => {
  let component: BulkSummaryQuestionListComponent;
  let fixture: ComponentFixture<BulkSummaryQuestionListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BulkSummaryQuestionListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkSummaryQuestionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
