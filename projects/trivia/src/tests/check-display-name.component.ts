import 'reflect-metadata';
// tslint:disable-next-line: max-line-length
import { CheckDisplayNameComponent } from '../../../shared-library/src/lib/shared/components/check-display-name/check-display-name.component.tns';
import { Utils } from './../../../shared-library/src/lib/core/services/utils';
import { ElementRef } from '@angular/core';
import { nsTestBedBeforeEach, nsTestBedAfterEach, nsTestBedRender, nsTestBedInit } from 'nativescript-angular/testing';

describe('CheckDisplayNameComponent', () => {
    beforeAll(() => nsTestBedInit());
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
    it('should create', () => {
        return nsTestBedRender(CheckDisplayNameComponent).then((fixture) => {
            const component = fixture.componentInstance;
            expect(component).toBeTruthy();
        });
    });

    it('on onChanges call it should set focus on textbox', () => {
        return nsTestBedRender(CheckDisplayNameComponent).then((fixture) => {
            const component = fixture.componentInstance;
            component.textField = new ElementRef('any');
            const spy = spyOn(component.utils, 'focusTextField').and.callThrough();
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
    });

});
