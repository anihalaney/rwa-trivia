import { Component, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { User, Question } from 'shared-library/shared/model';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { ModalDialogParams } from 'nativescript-angular/modal-dialog';

@Component({
  selector: 'app-preview-question-dialog',
  templateUrl: './preview-question-dialog.component.html',
  styleUrls: ['./preview-question-dialog.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})

@AutoUnsubscribe({ 'arrayName': 'subscriptions' })
export class PreviewQuestionDialogComponent implements OnDestroy {

  user: User;
  navLinks = [];
  ref: any;
  subscriptions = [];
  question: Question;
  categoryDictionary: any;
  categoryName = '';

  constructor(private params: ModalDialogParams,
    public cd: ChangeDetectorRef) {
    setTimeout(() => {
      this.question = params.context.question;
      this.categoryDictionary = params.context.categoryDictionary;

      this.categoryName = this.question.categoryIds.map(category => {
        if (this.categoryDictionary[category]) {
          return this.categoryDictionary[category].categoryName;
        } else {
          return '';
        }
      }).join(',');
      this.cd.markForCheck();
    }, 0);
  }

  ngOnDestroy() {

  }

  onClose(): void {
    this.params.closeCallback();
  }


}
