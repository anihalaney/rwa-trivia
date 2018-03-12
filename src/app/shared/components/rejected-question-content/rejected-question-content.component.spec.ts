import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectedQuestionContentComponent } from './rejected-question-content.component';

describe('RejectedQuestionContentComponent', () => {
  let component: RejectedQuestionContentComponent;
  let fixture: ComponentFixture<RejectedQuestionContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RejectedQuestionContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RejectedQuestionContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
