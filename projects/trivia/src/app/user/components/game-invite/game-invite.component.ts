import { Component, Input, OnChanges, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { User, Game, Category, GameStatus } from '../../../../../../shared-library/src/lib/shared/model';
import { AppState, appState, categoryDictionary } from '../../../store';
import * as gameplayactions from '../../../game-play/store/actions';
import { gameInvites } from '../../../game-play/store';
import { Utils } from '../../../../../../shared-library/src/lib/core/services';

@Component({
  selector: 'game-invite',
  templateUrl: './game-invite.component.html',
  styleUrls: ['./game-invite.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameInviteComponent implements OnChanges, OnDestroy {

  @Input() userDict: { [key: string]: User } = {};
  @Input() game: Game;
  categoryDict$: Observable<{ [key: number]: Category }>;
  categoryDict: { [key: number]: Category };
  randomCategoryId = 0;
  gameStatus;
  subs: Subscription[] = [];


  constructor(private store: Store<AppState>) {
    this.categoryDict$ = store.select(categoryDictionary);
    this.subs.push(this.categoryDict$.subscribe(categoryDict => this.categoryDict = categoryDict));
  }

  ngOnChanges() {
    this.randomCategoryId = Math.floor(Math.random() * this.game.gameOptions.categoryIds.length);
    this.gameStatus = (this.game.GameStatus === GameStatus.WAITING_FOR_RANDOM_PLAYER_INVITATION_ACCEPTANCE) ? 'Random' : 'Friend'
  }

  rejectGameInvitation() {
    this.store.dispatch(new gameplayactions.RejectGameInvitation(this.game.gameId));
  }

  ngOnDestroy() {
    Utils.unsubscribe(this.subs);
  }
}
