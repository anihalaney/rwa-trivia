import 'reflect-metadata';
import { AnimationBoxComponent } from 'shared-library/shared/mobile/component/animation-box/animation-box.component';
import { Utils } from 'shared-library/core/services/utils';
import { nsTestBedBeforeEach, nsTestBedAfterEach, nsTestBedRender } from 'nativescript-angular/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

describe('AnimationBoxComponent', () => {

    let component: AnimationBoxComponent;
    let fixture: ComponentFixture<AnimationBoxComponent>;

    afterAll(() => { });
    beforeEach(nsTestBedBeforeEach([AnimationBoxComponent], [
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
        fixture = await nsTestBedRender(AnimationBoxComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('on call ngOnInit it should set truthy', () => {
        component.ngOnInit();
        expect(component.isDisplay).toBeTruthy();
    });

    it('on call editField it should display field and hide label', () => {
        component.fieldName = 'name';
        component.showEdit = true;
        component.textBoxContainers.nativeElement = { animate: () => { } };
        component.nameField = { nativeElement: { animate: () => { } } };
        component.nameLabel = { nativeElement: { animate: () => { } } };
        component.nameLabelField = { nativeElement: { animate: () => { } } };

        component.editField();
        expect(component.nameField.nativeElement.visibility).toBe('visible');
        expect(component.nameLabel.nativeElement.visibility).toBe('collapsed');
        expect(component.nameLabelField.nativeElement.visibility).toBe('collapsed');
        expect(component.showEdit).toBeFalsy();
    });

    it('on call editField it should display field and hide label and set focus on text box', () => {

        const services = TestBed.get(Utils);
        const spyOnfocusTextField = spyOn(services, 'focusTextField').and.returnValue('');
        component.fieldName = 'name';
        component.fieldValue = 'Mack';
        component.showEdit = true;
        component.textBoxContainers.nativeElement = { animate: () => { } };
        component.nameField = { nativeElement: { animate: () => { } } };
        component.nameLabel = { nativeElement: { animate: () => { } } };
        component.nameLabelField = { nativeElement: { animate: () => { } } };
        component.editField();
        expect(component.nameField.nativeElement.visibility).toBe('visible');
        expect(component.nameLabel.nativeElement.visibility).toBe('collapsed');
        expect(component.nameLabelField.nativeElement.visibility).toBe('collapsed');
        expect(spyOnfocusTextField).toHaveBeenCalledTimes(1);
    });



    it('on call editField it should hide field and display label and emit field name', () => {
        spyOn(component.formSubmitted, 'emit');
        spyOn(component, 'screenWidth').and.returnValue(200);
        component.fieldName = 'name';
        component.fieldValue = 'Mack';
        component.showEdit = true;
        component.textBoxContainers.nativeElement = {
            animate: () => { },
            width: 200
        };
        component.nameField = { nativeElement: { animate: () => { } } };
        component.nameLabel = { nativeElement: { animate: () => { } } };
        component.nameLabelField = { nativeElement: { animate: () => { } } };
        component.editField();
        expect(component.nameField.nativeElement.visibility).toBe('collapsed');
        expect(component.nameLabel.nativeElement.visibility).toBe('visible');
        expect(component.nameLabelField.nativeElement.visibility).toBe('visible');
        expect(component.formSubmitted.emit).toHaveBeenCalledWith('name');
    });

    it('on call ngAfterContentInit it should set focus on text box if text Field Content exist', () => {
        component.textFieldContent = {};
        component.showEdit = true;
        const services = TestBed.get(Utils);
        const spyOnfocusTextField = spyOn(services, 'focusTextField').and.returnValue('');
        component.ngAfterContentInit();
        expect(spyOnfocusTextField).toHaveBeenCalledTimes(1);
    });

    it('on call location it should  emit getCurrentLocation', () => {
        spyOn(component.getCurrentLocation, 'emit');
        component.location();
        expect(component.getCurrentLocation.emit).toHaveBeenCalledWith();
    });

});
