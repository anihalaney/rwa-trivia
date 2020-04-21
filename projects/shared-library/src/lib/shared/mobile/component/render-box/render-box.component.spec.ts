import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RenderBoxComponent } from './render-box.component';

describe('RenderBoxComponent', () => {
  let component: RenderBoxComponent;
  let fixture: ComponentFixture<RenderBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RenderBoxComponent ]
    })
    .compileComponents();
  }));
  

  beforeEach(() => {
    fixture = TestBed.createComponent(RenderBoxComponent);
    component = fixture.debugElement.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
