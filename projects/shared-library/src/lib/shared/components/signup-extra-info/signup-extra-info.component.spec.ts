import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupExtraInfoComponent } from './signup-extra-info.component';

describe('SignupExtraInfoComponent', () => {
  let component: SignupExtraInfoComponent;
  let fixture: ComponentFixture<SignupExtraInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignupExtraInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupExtraInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
