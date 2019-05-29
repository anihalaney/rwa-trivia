import { Component, OnInit, Renderer2, ChangeDetectionStrategy, OnDestroy, ViewChild, ChangeDetectorRef, Input } from '@angular/core';
import { take } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { User, Question } from 'shared-library/shared/model';
import { Utils } from 'shared-library/core/services';
import { AppState, appState } from '../../../../store';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Inject } from '@angular/core';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { CropperSettings, ImageCropperComponent } from 'ngx-img-cropper';

@Component({
  selector: 'app-preview-question-dialog',
  templateUrl: './preview-question-dialog.component.html',
  styleUrls: ['./preview-question-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

@AutoUnsubscribe({ 'arrayName': 'subscriptions' })
export class PreviewQuestionDialogComponent implements OnInit, OnDestroy {
  question: Question;
  user: User;
  navLinks = [];
  ref: any;
  subscriptions = [];

  constructor(@Inject(MAT_DIALOG_DATA) private data: any,
    public cd: ChangeDetectorRef) {
      this.question = data.question;
  }

  ngOnInit() {

    console.log(this.question );
  }
  closeModel() {
    this.ref.close();
  }

  ngOnDestroy() {

  }

}
