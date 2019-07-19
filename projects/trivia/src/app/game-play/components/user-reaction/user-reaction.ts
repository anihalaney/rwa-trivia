import { Input, ChangeDetectorRef, OnChanges, SimpleChanges, } from '@angular/core';
import { Question, User } from 'shared-library/shared/model';
import { Subscription } from 'rxjs';
import { gamePlayState, GamePlayState } from '../../store';
import { select, Store } from '@ngrx/store';
import * as gameplayactions from '../../store/actions';

export class UserReaction implements OnChanges {
  @Input() question: Question;
  @Input() user: User;
  subscriptions: Subscription[] = [];
  userReactionStatus;

  constructor(public store: Store<GamePlayState>, public cd: ChangeDetectorRef) {
    this.subscriptions.push(this.store.select(gamePlayState).pipe(select(s => s.updateUserReactionStatus)).subscribe(state => {
      if (state) {
        this.question.reactionsCount = state.reactionsCount;
      }
      this.cd.markForCheck();
    }));

    this.subscriptions.push(this.store.select(gamePlayState).pipe(select(s => s.getUserReactionStatus)).subscribe(s => {
        this.userReactionStatus = s;
        this.cd.markForCheck();
    }));

  }

  userReaction(status: string ) {
    this.store.dispatch(new gameplayactions.UserReaction({questionId: this.question.id, userId: this.user.userId, status: status}));
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.question && changes.user) {
      this.store.dispatch(new gameplayactions.GetUserReaction({ questionId : this.question.id, userId: this.user.userId }));
    }
  }

}
