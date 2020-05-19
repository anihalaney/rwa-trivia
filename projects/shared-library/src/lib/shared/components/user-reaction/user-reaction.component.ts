import { Component, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef, Input, SimpleChanges, OnChanges } from '@angular/core';
import { Question, User } from 'shared-library/shared/model';
import { Store, select } from '@ngrx/store';
import { AutoUnsubscribe } from 'shared-library/shared/decorators';
import { Subscription } from 'rxjs';
import { CoreState, coreState } from 'shared-library/core/store';
import { GameActions } from 'shared-library/core/store/actions';
import { AuthenticationProvider } from 'shared-library/core/auth';

@Component({
  selector: 'user-reaction',
  templateUrl: './user-reaction.component.html',
  styleUrls: ['./user-reaction.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

@AutoUnsubscribe({ 'arrayName': 'subscriptions' })
export class UserReactionComponent implements OnChanges, OnDestroy {
  @Input() question: Question;
  @Input() user: User;
  @Input() theme;
  subscriptions: Subscription[] = [];
  userReactionStatus;

  constructor(public store: Store<CoreState>, public cd: ChangeDetectorRef, public gameActions: GameActions,
    public authService: AuthenticationProvider) {
    this.subscriptions.push(this.store.select(coreState).pipe(select(s => s.getUserReactionStatus)).subscribe(s => {
      this.userReactionStatus = s;
      this.cd.markForCheck();
    }));
    this.subscriptions.push(this.store.select(coreState).pipe(select(s => s.getQuestionSuccess)).subscribe(question => {
      this.question = question;
      this.cd.markForCheck();
    }));

  }

  userReaction(status: string) {
    if (this.user && this.user.userId) {
      this.store.dispatch(this.gameActions.UserReaction({ questionId: this.question.id, userId: this.user.userId, status: status }));
    } else {
      this.authService.ensureLogin();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.question && this.user) {
      this.getUserReaction();
      this.getQuestion();
    }
  }

  getUserReaction() {
    this.store.dispatch(this.gameActions.GetUserReaction({
      questionId: this.question.id,
      userId: this.user.userId
    }));
  }

  getQuestion() {
    this.store.dispatch(this.gameActions.GetQuestion(this.question.id));
  }

  ngOnDestroy() {
  }
}
