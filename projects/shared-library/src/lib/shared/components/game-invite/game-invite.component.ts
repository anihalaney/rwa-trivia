import { Component, Input, OnChanges, ChangeDetectionStrategy, OnDestroy, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import {
  User, Game, Category, GameStatus,
  GameInviteConstants, CalenderConstants, userCardType
} from 'shared-library/shared/model';
import { CoreState, categoryDictionary } from './../../../core/store';
import { Utils } from 'shared-library/core/services';
import { UserActions } from 'shared-library/core/store/actions';
import { AutoUnsubscribe } from 'shared-library/shared/decorators';
import { Router } from '@angular/router';

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


  constructor(private store: Store<CoreState>, private utils: Utils, private userActions: UserActions, private router: Router) {
    this.categoryDict$ = store.select(categoryDictionary);
    this.subscriptions.push(this.categoryDict$.subscribe(categoryDict => this.categoryDict = categoryDict));

  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.game) {
      this.randomCategoryId = Math.floor(Math.random() * this.game.gameOptions.categoryIds.length);
      this.gameStatus = (this.game.GameStatus === GameStatus.WAITING_FOR_RANDOM_PLAYER_INVITATION_ACCEPTANCE) ? 'Random' : 'Friend';
      const currentTime = this.utils.getUTCTimeStamp();
      this.remainingDays = (GameInviteConstants.INVITATION_APPROVAL_TOTAL_DAYS -
        Math.floor(this.utils.getTimeDifference(this.game.turnAt, currentTime) / (CalenderConstants.DAYS_CALCULATIONS)));
    }
  }

  acceptGameInvitation(id) {
    this.router.navigate(['game-play', id]);
  }

  rejectGameInvitation() {
    this.store.dispatch(this.userActions.rejectGameInvitation(this.game.gameId));
  }

  otherInfo(game) {
    const category = this.getCategoryName(game, this.randomCategoryId);
    return {
      category: category, remainingDays: this.remainingDays, notificationText: 'sent you an invite to play game together'
    };
  }


  getCategoryName(game, randomCategoryId) {
    return this.categoryDict[game.gameOptions.categoryIds[randomCategoryId]].categoryName.charAt(0).toUpperCase() +
      this.categoryDict[game.gameOptions.categoryIds[randomCategoryId]].categoryName.slice(1);
  }

  ngOnDestroy() {
  }
}
