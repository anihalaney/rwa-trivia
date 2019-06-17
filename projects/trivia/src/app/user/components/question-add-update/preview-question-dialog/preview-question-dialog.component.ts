import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { User, Question } from 'shared-library/shared/model';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Inject } from '@angular/core';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';

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

  closeModel() {
    this.ref.close();
  }

  ngOnDestroy() {

  }

}
