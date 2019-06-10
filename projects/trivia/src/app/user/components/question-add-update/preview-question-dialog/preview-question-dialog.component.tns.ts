import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { User, Question } from 'shared-library/shared/model';
import { Inject } from '@angular/core';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { ModalDialogParams } from 'nativescript-angular/modal-dialog';

@Component({
  selector: 'app-preview-question-dialog',
  templateUrl: './preview-question-dialog.component.html',
  styleUrls: ['./preview-question-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

@AutoUnsubscribe({ 'arrayName': 'subscriptions' })
export class PreviewQuestionDialogComponent implements OnInit, OnDestroy {

  user: User;
  navLinks = [];
  ref: any;
  subscriptions = [];
  question: Question;

  constructor(private params: ModalDialogParams,
    public cd: ChangeDetectorRef) {
    this.question = params.context.question;
    console.log('<>>>>>>>>>>>>>');
    console.log(this.question);
  }

  ngOnInit() {
    // console.log(this.question);
  }


  ngOnDestroy() {

  }

  onClose(): void {
    this.params.closeCallback();
  }


}
