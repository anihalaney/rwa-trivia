import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CheckDisplayNameComponent } from './check-display-name.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Utils, WindowRef } from 'shared-library/core/services';
import { MatSnackBarModule } from '@angular/material';

describe('CheckDisplayNameComponent', () => {
  let component: CheckDisplayNameComponent;
  let fixture: ComponentFixture<CheckDisplayNameComponent>;
  let spy: any;
  const event = 'new text change';

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CheckDisplayNameComponent],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [MatSnackBarModule],
      providers: [WindowRef,
        Utils]
    });

    fixture = TestBed.createComponent(CheckDisplayNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Initial value of the myValue should be falsy and propagateChange should be truthy', () => {
    expect(component.propagateChange).toBeTruthy();
    expect(component.myValue).toBeFalsy();
  });

  it(`it should assign set disabled is false if isProfilePage is false`, () => {
    component.isProfilePage = false;
    component.ngOnInit();
    expect(component.disabled).toEqual(false);
  });

  it(`it should assign set disabled is true if isProfilePage is true`, () => {
    component.isProfilePage = true;
    component.ngOnInit();
    expect(component.disabled).toEqual(true);
  });

  it(`call to writeValue function should set the input text`, () => {
    component.writeValue(event);
    expect(component.myValue).toEqual(event);
  });

  it(`call to onTextChange function should emit the propagateChange event`, () => {
    spy = spyOn(component, 'propagateChange').and.callThrough();
    expect(spy);
    component.onTextChange(event);
    expect(component.propagateChange).toHaveBeenCalled();
  });

  it(`call to registerOnChange function should emit the propagateChange event`, () => {
    spy = spyOn(component, 'propagateChange').and.callThrough();
    expect(spy);
    component.registerOnChange(event);
    expect(component.propagateChange).toBe(event);
  });


  it(`call to setDisabledState and change the input disabled based on argument received`, () => {
    component.setDisabledState(true);
    expect(component.disabled).toEqual(true);
  });
});
