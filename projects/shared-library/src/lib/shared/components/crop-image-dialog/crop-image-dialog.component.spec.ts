import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ImageCropperComponent } from 'ngx-img-cropper';
import { CropImageDialogComponent } from './crop-image-dialog.component';
import { testData } from 'test/data';

const dialogRef = {
  close: () => { }
};

describe('CropImageDialogComponent', () => {
  let component: CropImageDialogComponent;
  let fixture: ComponentFixture<CropImageDialogComponent>;
  let spy: any;
  const file = new File([new ArrayBuffer(2e+5)], 'test-file.jpg', { lastModified: null, type: 'image/jpeg' });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CropImageDialogComponent, ImageCropperComponent],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [
        MatDialogModule
      ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: testData },
        { provide: MatDialogRef, useValue: dialogRef }
      ]
    });

    fixture = TestBed.createComponent(CropImageDialogComponent);
    component = fixture.componentInstance;

    component.data = {
      applicationSettings: testData.applicationSettings,
      file: file
    };
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Initial value of errorMsg ,ref should be falsy and remaining should be truthy', () => {
    expect(component.user).toBeUndefined();
    expect(component.ref).toBeFalsy();
    expect(component.cropperSettings).toBeTruthy();
    expect(component.profileImageFile).toBeTruthy();
    expect(component.errorMsg).toBeFalsy();
    expect(component.maxImageSize).toBeTruthy();
    expect(component.cropImage).toBeTruthy();

  });

  it('on load component should set maxImageSize and profileImageFile', async () => {
    const spyCropper = spyOn(component.cropper, 'setImage').and.callThrough();
    expect(spyCropper);
    component.ngOnInit();
    expect(component.maxImageSize).toEqual(testData.applicationSettings.max_image_size_of_question);
    expect(component.profileImageFile).toEqual(file);
    // we need to wait for file reader onload event to complete
    // before checking result
    await new Promise(r => setTimeout(r, 1000));
    expect(component.image.src).not.toBeUndefined();
    expect(component.cropper.setImage).toHaveBeenCalled();
  });

  it('on load of component, call to setCropperSettings should set cropper Settings', () => {
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


  it('call to closeModel should close the model dialogue and close function should be call', () => {
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

  it('call to onSaveClick should check the size of image and read the file', async () => {
    component.data.file = file;
    spy = spyOn(component, 'checkImageSize');
    expect(spy);
    component.onSaveClick();
    // we need to wait for file reader onload event to complete
    // before checking result
    await new Promise(r => setTimeout(r, 1000));
    expect(component.checkImageSize).toHaveBeenCalled();
  });

  it('call to checkImageSize should call getImageSize function and validate the image size', () => {
    component.maxImageSize = testData.applicationSettings.max_image_size_of_question;
    const cropImage = testData.file.base64Image;
    const spyGetImageSize = spyOn(component, 'getImageSize');
    const spyClose = spyOn(component.dialogRef, 'close');
    expect(spyGetImageSize);
    expect(spyClose);
    component.checkImageSize(cropImage);
    expect(component.getImageSize).toHaveBeenCalledWith(cropImage.image);
    expect(component.errorMsg).toEqual('');
    expect(component.dialogRef.close).toHaveBeenCalled();
  });

  it('Image size validation error should be displayed if selected image size is greater than maxImageSize', () => {
    component.maxImageSize = 0.5;
    const cropImage = testData.file.base64Image;
    spy = spyOn(component, 'getImageSize').and.callThrough();
    expect(spy);
    component.checkImageSize(cropImage);
    expect(component.getImageSize).toHaveBeenCalled();
    const imageSize = component.getImageSize(cropImage.image);
    expect(component.errorMsg).toEqual(`Image size should be less than 0.5 KB`);
    });

  it('call to getImageSize should calculate the size of image', () => {
    const imageSize = component.getImageSize(testData.file.base64Image.image);
    expect(imageSize).toBe(0.53173828125);
  });

});


