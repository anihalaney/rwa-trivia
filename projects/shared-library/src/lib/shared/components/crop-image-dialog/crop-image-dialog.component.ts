import { Component, OnInit, Renderer2, ChangeDetectionStrategy, OnDestroy, ViewChild, ChangeDetectorRef } from '@angular/core';
import { take } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { User } from 'shared-library/shared/model';
import { Utils } from 'shared-library/core/services';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Inject } from '@angular/core';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { CropperSettings, ImageCropperComponent } from 'ngx-img-cropper';

@Component({
  selector: 'app-crop-image-dialog',
  templateUrl: './crop-image-dialog.component.html',
  styleUrls: ['./crop-image-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

@AutoUnsubscribe({ 'arrayName': 'subscriptions' })
export class CropImageDialogComponent implements OnInit, OnDestroy {

  user: User;
  navLinks = [];
  ref: any;
  subscriptions = [];
  cropperSettings: CropperSettings;
  profileImageFile: File;
  cropImage: { image: any } = { image: '/assets/images/default-avatar-small.png' };;
  image: any = {};
  errorMsg = '';
  maxImageSize: number;

  @ViewChild('cropper') cropper: ImageCropperComponent;

  constructor(@Inject(MAT_DIALOG_DATA) private data: any,
    public cd: ChangeDetectorRef) {
    this.setCropperSettings();
  }

  ngOnInit() {

    this.maxImageSize = this.data.applicationSettings.max_image_size_of_question;
    this.image = new Image();
    this.profileImageFile = this.data.file;
    const reader: FileReader = new FileReader();

    reader.onloadend = (loadEvent: any) => {
      this.image.src = loadEvent.target.result;
      this.cropper.setImage(this.image);
    };
    reader.readAsDataURL(this.profileImageFile);
  }

  private setCropperSettings() {
    this.cropperSettings = new CropperSettings();
    this.cropperSettings.noFileInput = true;
    this.cropperSettings.width = 150;
    this.cropperSettings.height = 140;
    this.cropperSettings.croppedWidth = 150;
    this.cropperSettings.croppedHeight = 140;
    this.cropperSettings.canvasWidth = 300;
    this.cropperSettings.canvasHeight = 280;
    this.cropperSettings.minWidth = 10;
    this.cropperSettings.minHeight = 10;
    this.cropperSettings.rounded = false;
    this.cropperSettings.keepAspect = false;
    this.cropperSettings.cropperDrawSettings.strokeColor = 'rgba(255,255,255,1)';
    this.cropperSettings.cropperDrawSettings.strokeWidth = 2;
  }

  closeModel() {
    this.ref.close();
  }

  ngOnDestroy() {

  }

  onCropClick() {
    this.checkImageSize(this.cropImage);
  }

  onSaveClick() {
    let base64File = { image: String };
    // Convert image into base64
    const reader = new FileReader();
    const file = this.data.file;
    reader.readAsDataURL(file);
    reader.onload = (fileReader) => {
      base64File = { image: fileReader.target['result'] };
      this.checkImageSize(base64File);
    };
  }

  getImageSize(base64File) {
    return (base64File.length * 0.75) / 1024;
  }

  checkImageSize(cropImage) {
    const imageSize = this.getImageSize(cropImage.image);
    if (imageSize > this.maxImageSize) {
      this.cd.markForCheck();
      this.errorMsg = `Image size should be less than ${this.maxImageSize} KB`;
    } else {
      this.ref.close(cropImage);
    }
  }
}
