import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { UtilsCore } from './utilsCore';
import { DomSanitizer } from '@angular/platform-browser';
import { MatSnackBar } from '@angular/material';
import { Observable, of } from 'rxjs';
// tslint:disable-next-line:max-line-length
import { GameOptions, Game, User, FirebaseAnalyticsKeyConstants, FirebaseAnalyticsEventConstants, OpponentType, GameConstants, GameMode, PlayerMode, GeneralConstants } from 'shared-library/shared/model';
import { WindowRef } from './windowref.service';


@Injectable()
export class Utils extends UtilsCore {

  constructor(
    @Inject(PLATFORM_ID) public platformId: Object,
    public sanitizer: DomSanitizer,
    private snackBar: MatSnackBar,
    private windowRef: WindowRef
  ) {
    super(platformId, sanitizer);
  }

  showMessage(type: string, msg: string) {
    this.snackBar.open(String(msg), '', {
      duration: 2000,
    });
  }

  setLoginFirebaseAnalyticsParameter(user: User): Observable<User> {
    if (this.windowRef.isDataLayerAvailable()) {
      this.windowRef.addAnalyticsParameters(FirebaseAnalyticsKeyConstants.USER_ID, user.userId);
      this.windowRef.pushAnalyticsEvents(FirebaseAnalyticsEventConstants.USER_LOGIN);
    }
    return of(user);
  }

  setNewGameFirebaseAnalyticsParameter(gameOptions: GameOptions, userId: string, gameId: string): Observable<string> {
    if (this.windowRef.isDataLayerAvailable()) {
      this.windowRef.addAnalyticsParameters(FirebaseAnalyticsKeyConstants.USER_ID, userId);
      this.windowRef.addAnalyticsParameters(FirebaseAnalyticsKeyConstants.OPPONENT_TYPE,
        gameOptions.opponentType === OpponentType.Random ? GameConstants.RANDOM : GameConstants.FRIEND);
      this.windowRef.addAnalyticsParameters(FirebaseAnalyticsKeyConstants.GAME_MODE,
        gameOptions.gameMode === GameMode.Normal ? GameConstants.NORMAL : GameConstants.OFFLINE);
      this.windowRef.addAnalyticsParameters(FirebaseAnalyticsKeyConstants.CATEGORY_IDS, JSON.stringify(gameOptions.categoryIds));
      this.windowRef.addAnalyticsParameters(FirebaseAnalyticsKeyConstants.TAGS, JSON.stringify(gameOptions.tags));
      this.windowRef.pushAnalyticsEvents(FirebaseAnalyticsEventConstants.START_NEW_GAME);
    }
    return of(gameId);
  }

  setEndGameFirebaseAnalyticsParameter(game: Game, userId: string, otherUserId: string): Observable<string> {
    if (this.windowRef.isDataLayerAvailable()) {
      this.windowRef.addAnalyticsParameters(FirebaseAnalyticsKeyConstants.GAME_ID, game.gameId);
      this.windowRef.addAnalyticsParameters(FirebaseAnalyticsKeyConstants.USER_ID, userId);
      this.windowRef.addAnalyticsParameters(FirebaseAnalyticsKeyConstants.PLAYER_MODE,
        game.gameOptions.playerMode === PlayerMode.Single ? GameConstants.SINGLE : GameConstants.OPPONENT);

      if (game.gameOptions.playerMode === PlayerMode.Opponent) {
        this.windowRef.addAnalyticsParameters(FirebaseAnalyticsKeyConstants.OPPONENT_TYPE,
          game.gameOptions.opponentType === OpponentType.Random ? GameConstants.RANDOM : GameConstants.FRIEND);
        this.windowRef.addAnalyticsParameters(FirebaseAnalyticsKeyConstants.OTHER_USER_ID, otherUserId);
        this.windowRef.addAnalyticsParameters(FirebaseAnalyticsKeyConstants.OTHER_USER_SCORE,
          game.stats[otherUserId].score.toString());

        if (game.round < 16 && game.stats[userId].score === game.stats[otherUserId].score) {
          this.windowRef.addAnalyticsParameters(FirebaseAnalyticsKeyConstants.IS_TIE, GeneralConstants.TRUE);
        } else {
          let winPlayerId = otherUserId;
          if (game.round < 16 && game.stats[userId].score > game.stats[otherUserId].score) {
            winPlayerId = userId;
          }
          this.windowRef.addAnalyticsParameters(FirebaseAnalyticsKeyConstants.WINNER_PLAYER_ID, winPlayerId);
        }

      } else {
        this.windowRef.addAnalyticsParameters(FirebaseAnalyticsKeyConstants.GAME_STATUS,
          (game.playerQnAs.length - game.stats[userId].score !== 4) ? GeneralConstants.WIN : GeneralConstants.LOST);
      }

      this.windowRef.addAnalyticsParameters(FirebaseAnalyticsKeyConstants.USER_SCORE,
        game.stats[userId].score.toString());
      this.windowRef.addAnalyticsParameters(FirebaseAnalyticsKeyConstants.GAME_MODE,
        game.gameOptions.gameMode === GameMode.Normal ? GameConstants.NORMAL : GameConstants.OFFLINE);
      this.windowRef.addAnalyticsParameters(FirebaseAnalyticsKeyConstants.CATEGORY_IDS, JSON.stringify(game.gameOptions.categoryIds));
      this.windowRef.addAnalyticsParameters(FirebaseAnalyticsKeyConstants.TAGS, JSON.stringify(game.gameOptions.tags));
      this.windowRef.addAnalyticsParameters(FirebaseAnalyticsKeyConstants.ROUND, game.round.toString());
      this.windowRef.pushAnalyticsEvents(FirebaseAnalyticsEventConstants.COMPLETED_GAME);
    }
    return of('success');
  }

  setUserLocationFirebaseAnalyticsParameter(user: User, isLocationChanged: boolean): Observable<string> {
    if (this.windowRef.isDataLayerAvailable() && isLocationChanged) {
      this.windowRef.addAnalyticsParameters(FirebaseAnalyticsKeyConstants.USER_ID, user.userId);
      this.windowRef.addAnalyticsParameters(FirebaseAnalyticsKeyConstants.LOCATION, user.location);
      this.windowRef.pushAnalyticsEvents(FirebaseAnalyticsEventConstants.USER_LOCATION);
    }
    return of('success');
  }



}
