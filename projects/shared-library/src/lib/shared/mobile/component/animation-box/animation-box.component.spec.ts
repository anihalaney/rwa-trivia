import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimationBoxComponent } from './animation-box.component';

describe('AnimationBoxComponent', () => {
  let component: AnimationBoxComponent;
  let fixture: ComponentFixture<AnimationBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnimationBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnimationBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
