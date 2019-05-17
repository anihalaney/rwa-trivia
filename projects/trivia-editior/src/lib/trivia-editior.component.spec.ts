import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TriviaEditiorComponent } from './trivia-editior.component';

describe('TriviaEditiorComponent', () => {
  let component: TriviaEditiorComponent;
  let fixture: ComponentFixture<TriviaEditiorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TriviaEditiorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TriviaEditiorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
