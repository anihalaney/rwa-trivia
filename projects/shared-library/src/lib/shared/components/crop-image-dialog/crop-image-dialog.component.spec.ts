import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CropImageDialogComponent } from './crop-image-dialog.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { CoreState } from 'shared-library/core/store';
import { coreState, UserActions, ActionWithPayload } from '../../../core/store';

import { Utils, WindowRef } from 'shared-library/core/services';
// import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { testData } from 'test/data';

const dialogRef = {
  close: () => { }
};


describe('CropImageDialogComponent', () => {
  let component: CropImageDialogComponent;
  let fixture: ComponentFixture<CropImageDialogComponent>;
  let spy: any;
  // let mockStore: MockStore<AppState>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CropImageDialogComponent],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [MatSnackBarModule,
        MatDialogModule
      ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: testData },
        { provide: MatDialogRef, useValue: dialogRef },
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
    expect(component.user).toBeUndefined();
    expect(component.ref).toBeFalsy();
    expect(component.cropperSettings).toBeTruthy();
    expect(component.profileImageFile).toBeFalsy();
    expect(component.errorMsg).toBeFalsy();
    expect(component.maxImageSize).toBeFalsy();
    expect(component.cropImage).toBeTruthy();
  });

  it('on load component should set applicationSettings', () => {
    component.data.applicationSettings = testData.applicationSettings;
    // const file: File = {
    //   'name': 'dot.png',
    //   'lastModified': 1590147652508,
    //   // 'lastModifiedDate': '2020-05-22T11:40:52.508Z',
    //   // 'webkitRelativePath': '',
    //   'size': 85,
    //   'type': 'image/png',
    //   'slice': null,
    //   // 'stream': function stream() { },
    //   // 'text': function text() { },
    //   // 'arrayBuffer': function arrayBuffer() { }
    // }
    // component.profileImageFile = file;
    // component.ngOnInit();
    // expect(component.applicationSettings).toStrictEqual(testData.applicationSettings);
  });

  it('call to setCropperSettings should set cropper Settings', () => {
    component.setCropperSettings();
    expect(component.cropperSettings.noFileInput).toEqual(true);
    expect(component.cropperSettings.width).toEqual(150);
    expect(component.cropperSettings.height).toEqual(140);
    expect(component.cropperSettings.croppedWidth).toEqual(150);
    expect(component.cropperSettings.croppedHeight).toEqual(140);
    expect(component.cropperSettings.canvasWidth).toEqual(300);
    expect(component.cropperSettings.canvasHeight).toEqual(280);
    expect(component.cropperSettings.minWidth).toEqual(10);
    expect(component.cropperSettings.minHeight).toEqual(10);
    expect(component.cropperSettings.rounded).toEqual(false);
    expect(component.cropperSettings.keepAspect).toEqual(false);
    expect(component.cropperSettings.cropperDrawSettings.strokeColor).toEqual('rgba(255,255,255,1)');
    expect(component.cropperSettings.cropperDrawSettings.strokeWidth).toEqual(2);
  });


  it('call to closeModel should close the model dialouge and close function should be call', () => {
    spy = spyOn(component.dialogRef, 'close');
    expect(spy);
    component.closeModel();
    expect(component.dialogRef.close).toHaveBeenCalled();
  });

  it('call to onCropClick should check the size of image', () => {
    component.cropImage = { image: '/assets/images/default-avatar-small.png' };
    spy = spyOn(component, 'checkImageSize');
    expect(spy);
    component.onCropClick();
    expect(component.checkImageSize).toHaveBeenCalled();
  });

  it('call to onSaveClick should check the size of image and read the file', () => {
    // spy = spyOn(component, 'checkImageSize');
    // expect(spy);
    // component.onSaveClick();
    // expect(component.checkImageSize).toHaveBeenCalled();
  });

  it('call to checkImageSize should call getImageSize function and validate the image size', () => {
    component.maxImageSize = testData.applicationSettings.max_image_size_of_question;
    const cropImage = { image: '/assets/images/default-avatar-small.png' };
    spy = spyOn(component, 'getImageSize');
    expect(spy);
    component.checkImageSize(cropImage);
    expect(component.getImageSize).toHaveBeenCalled();
    expect(component.errorMsg).toEqual('Image size should be less than 4000 KB');
  });

  it('call to getImageSize should calculate the size of image', () => {
    component.getImageSize({lenght: 4000 });
    expect(component.getImageSize).toBe(2.9296875);
  });



});
