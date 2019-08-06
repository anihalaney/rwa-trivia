import { Input, ChangeDetectorRef, OnChanges, SimpleChanges, } from '@angular/core';
import { Question, User } from 'shared-library/shared/model';
import { Subscription } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { AppState } from './../../../../../../trivia/src/app/store';

import { coreState } from 'shared-library/core/store';
import { GameActions } from 'shared-library/core/store/actions';
import { AuthenticationProvider } from 'shared-library/core/auth';
export class UserReaction implements OnChanges {
  @Input() question: Question;
  @Input() user: User;
  subscriptions: Subscription[] = [];
  userReactionStatus;

  constructor(public store: Store<AppState>, public cd: ChangeDetectorRef, public gameActions: GameActions,
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

  userReaction(status: string ) {
    if (this.user && this.user.userId) {
      this.store.dispatch(this.gameActions.UserReaction({questionId: this.question.id, userId: this.user.userId, status: status}));
    } else {
      this.authService.ensureLogin();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.question && this.user) {
        this.store.dispatch(this.gameActions.GetUserReaction({ questionId : this.question.id,
        userId: this.user.userId }));
        this.store.dispatch(this.gameActions.GetQuestion(this.question.id));
    }
  }

}
