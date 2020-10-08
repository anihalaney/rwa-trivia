import { Component, OnDestroy, ChangeDetectorRef, Input, SimpleChanges, OnChanges } from '@angular/core';
import { User, Question, Category } from 'shared-library/shared/model';
import { AutoUnsubscribe } from 'shared-library/shared/decorators';
import { ModalDialogParams } from 'nativescript-angular/modal-dialog';

@Component({
  selector: 'app-preview-question-dialog',
  templateUrl: './preview-question-dialog.component.html',
  styleUrls: ['./preview-question-dialog.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})

@AutoUnsubscribe({ 'arrayName': 'subscriptions' })
export class PreviewQuestionDialogComponent implements OnChanges, OnDestroy {

  user: User;
  navLinks = [];
  ref: any;
  subscriptions = [];
  categoryName = '';
  theme: string;
  @Input() question: Question;
  @Input() categoryDictionary: Category[];

  constructor(public cd: ChangeDetectorRef) {

  }
  ngOnChanges(changes: SimpleChanges): void {
    if (this.categoryDictionary &&  this.question && this.question.categoryIds) {
      this.categoryName = this.question.categoryIds.map(category => {
        if (this.categoryDictionary[category]) {
          return this.categoryDictionary[category].categoryName;
        } else {
          return '';
        }
      }).join(',');
    }
  }

  ngOnDestroy() {

  }



}
