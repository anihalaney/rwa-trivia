import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkSummaryComponent } from './bulk-summary.component';

describe('BulkSummaryComponent', () => {
  let component: BulkSummaryComponent;
  let fixture: ComponentFixture<BulkSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BulkSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
