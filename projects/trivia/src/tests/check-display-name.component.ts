import 'reflect-metadata';
import { CheckDisplayNameComponent } from 'shared-library/shared/components/check-display-name/check-display-name.component';
import { Utils } from 'shared-library/core/services/utils';
import { ElementRef } from '@angular/core';
import { nsTestBedBeforeEach, nsTestBedAfterEach, nsTestBedRender } from 'nativescript-angular/testing';
import { ComponentFixture } from '@angular/core/testing';

describe('CheckDisplayNameComponent', () => {

    let component: CheckDisplayNameComponent;
    let fixture: ComponentFixture<CheckDisplayNameComponent>;
    let spy: any;
    const event = 'new text change';

    afterAll(() => { });
    beforeEach(nsTestBedBeforeEach([CheckDisplayNameComponent], [
        {
            provide: Utils,
            useValue: {
                focusTextField() {
                    return '';
                }
            }
        }
    ]));
    afterEach(nsTestBedAfterEach());


    beforeEach((async () => {
        fixture = await nsTestBedRender(CheckDisplayNameComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('on onChanges call it should set focus on textbox', () => {
        component.textField = new ElementRef('any');
        spy = spyOn(component.utils, 'focusTextField').and.callThrough();
        expect(spy);
        component.ngOnChanges({
            disabled:
            {
                previousValue: undefined,
                currentValue: true,
                firstChange: true,
                isFirstChange: undefined
            }
        });
        expect(component.utils.focusTextField).toHaveBeenCalled();
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
