import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CropImageDialogComponent } from './crop-image-dialog.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { CoreState } from 'shared-library/core/store';
import { coreState, UserActions, ActionWithPayload } from '../../../core/store';

import { Utils, WindowRef } from 'shared-library/core/services';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material';
import {
  MatFormFieldModule,
  MatInputModule,
  MatDialogModule,
  MatButtonModule,
  MatRadioModule,
  MatSelectModule
} from '@angular/material';


describe('CropImageDialogComponent', () => {
  let component: CropImageDialogComponent;
  let fixture: ComponentFixture<CropImageDialogComponent>;
  let spy: any;
  // let mockStore: MockStore<AppState>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CropImageDialogComponent],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [MatSnackBarModule, MatFormFieldModule,
        MatInputModule,
        MatDialogModule],
      providers: [
        { provide: MatDialogRef, useValue: {} },
            { provide: MAT_DIALOG_DATA, useValue: { myData: [] } },
        provideMockStore({
          initialState: {},
          selectors: [
            {
              selector: coreState,
              value: {}
            }
          ]
        }),
        WindowRef,
        Utils]
    });

    fixture = TestBed.createComponent(CropImageDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Initial value of the myValue should be falsy and propagateChange should be truthy', () => {
    // expect(component.user).toBeTruthy();
    // expect(component.ref).toBeFalsy();
    // expect(component.cropperSettings).toBeFalsy();
    // expect(component.subscriptions).toBeFalsy();
    // expect(component.profileImageFile).toBeFalsy();
    // expect(component.image).toBeFalsy();
    // expect(component.errorMsg).toBeFalsy();
    // expect(component.maxImageSize).toBeFalsy();
    // expect(component.cropImage).toBeTruthy();
  });

//   it(`show disabled if component is called from other than profile page `, () => {
//     component.isProfilePage = false;
//     component.ngOnInit();
//     expect(component.disabled).toEqual(false);
//   });

//   it(`call to writeValue function should set the input text`, () => {
//     spy = spyOn(component, 'writeValue');
//     component.writeValue(event);
//     expect(component.myValue).toEqual(event);
//   });

//   it(`call to onTextChange function should emit the propagateChange event`, () => {
//     spy = spyOn(component, 'propagateChange').and.callThrough();
//     expect(spy);
//     component.onTextChange(event);
//     expect(component.propagateChange).toHaveBeenCalled();
//   });

//   it(`call to registerOnChange function should emit the propagateChange event`, () => {
//     spy = spyOn(component, 'propagateChange').and.callThrough();
//     expect(spy);
//     component.registerOnChange(event);
//     expect(component.propagateChange).toBe(event);
//   });


//   it(`call to setDisabledState and change the input disabled based on argument received`, () => {
//     component.setDisabledState(true);
//     expect(component.disabled).toEqual(true);
//   });
});
