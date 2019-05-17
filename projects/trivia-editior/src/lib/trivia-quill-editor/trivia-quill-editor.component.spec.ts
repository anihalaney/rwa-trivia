import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TriviaQuillEditorComponent } from './trivia-quill-editor.component';

describe('TriviaQuillEditorComponent', () => {
  let component: TriviaQuillEditorComponent;
  let fixture: ComponentFixture<TriviaQuillEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TriviaQuillEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TriviaQuillEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
