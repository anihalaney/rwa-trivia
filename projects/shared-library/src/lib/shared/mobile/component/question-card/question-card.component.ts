import { Component, OnInit, Input, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { AutoUnsubscribe } from 'shared-library/shared/decorators';
import { Question } from './../../../model/question';
import { select, Store } from '@ngrx/store';
import { CoreState, coreState } from '../../../../core/store';
import { ApplicationSettings, Answer, User } from 'shared-library/shared/model';

@Component({
  selector: 'app-question-card',
  templateUrl: './question-card.component.html',
  styleUrls: ['./question-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

@AutoUnsubscribe({ 'arrayName': 'subscriptions' })
export class QuestionCardComponent implements OnInit, OnDestroy, OnChanges {
  @Input() user: User;
  @Input() question: Question;
  @Input() categoryName: string;
  @Input() theme: string;
  categoryDictionary: any;
  subscriptions = [];
  applicationSettings: ApplicationSettings;
  @Input() answeredText: string;
  @Input() correctAnswerText: string;
  @Input() doPlay: boolean;
  @Output() answerClicked = new EventEmitter<number>();
  @Output() selectedAnswer = new EventEmitter<string>();
  renderView = false;
  constructor(private store: Store<CoreState>, private cd: ChangeDetectorRef) { }

  ngOnInit() {
    this.subscriptions.push(this.store.select(coreState).pipe(select(s => s.applicationSettings))
      .subscribe(appSettings => {
        if (appSettings) {
          this.applicationSettings = appSettings[0];
          this.cd.markForCheck();
        }
      }));
    if (this.question) {
      this.question.answers.forEach((item) => {
        if (item.correct === true) {
          this.correctAnswerText = item.answerText;
        }
      });
    }
  }

  answerButtonClicked(answer: Answer) {
    if (this.doPlay) {
      this.answeredText = answer.answerText;
      this.doPlay = false;
      const index = this.question.answers.findIndex(x => x.answerText === answer.answerText);
      this.answerClicked.emit(index);

      this.cd.markForCheck();
    }
  }

  rippleTap(answer) {
    this.answerButtonClicked(answer);
    this.selectedAnswer.emit(answer);
  }

  ngOnDestroy(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.question) {
      this.doPlay = true;
    }

  }

}
