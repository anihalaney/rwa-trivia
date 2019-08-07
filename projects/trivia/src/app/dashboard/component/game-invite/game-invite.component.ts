import { Component, Input, OnChanges, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import {
  User, Game, Category, GameStatus,
  GameInviteConstants, CalenderConstants, userCardType
} from 'shared-library/shared/model';
import { AppState,  categoryDictionary } from '../../../store';
import { Utils } from 'shared-library/core/services';
import { UserActions } from 'shared-library/core/store/actions';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';

@Component({
  selector: 'game-invite',
  templateUrl: './game-invite.component.html',
  styleUrls: ['./game-invite.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

@AutoUnsubscribe({ 'arrayName': 'subscriptions' })
export class GameInviteComponent implements OnChanges, OnDestroy {

  @Input() game: Game;
  categoryDict$: Observable<{ [key: number]: Category }>;
  categoryDict: { [key: number]: Category };
  randomCategoryId = 0;
  gameStatus;
  remainingDays: number;
  subscriptions = [];
  userCardType = userCardType;


  constructor(private store: Store<AppState>, private utils: Utils, private userActions: UserActions) {
    this.categoryDict$ = store.select(categoryDictionary);
    this.subscriptions.push(this.categoryDict$.subscribe(categoryDict => this.categoryDict = categoryDict));
  }

  ngOnChanges() {
    if (this.game) {
      this.randomCategoryId = Math.floor(Math.random() * this.game.gameOptions.categoryIds.length);
      this.gameStatus = (this.game.GameStatus === GameStatus.WAITING_FOR_RANDOM_PLAYER_INVITATION_ACCEPTANCE) ? 'Random' : 'Friend';
      const currentTime =  this.utils.getUTCTimeStamp();
      this.remainingDays = (GameInviteConstants.INVITATION_APPROVAL_TOTAL_DAYS -
        Math.floor(this.utils.getTimeDifference(this.game.turnAt, currentTime) / (CalenderConstants.DAYS_CALCULATIONS)));
    }
  }

  rejectGameInvitation() {
    this.store.dispatch(this.userActions.rejectGameInvitation(this.game.gameId));
  }


  ngOnDestroy() {
  }
}
