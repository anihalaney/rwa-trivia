import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { UtilsCore } from './utilsCore';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { User, GameOptions, Game } from 'shared-library/shared/model';
@Injectable()
export class Utils extends UtilsCore {

  constructor(
    @Inject(PLATFORM_ID) public platformId: Object,
    public sanitizer: DomSanitizer
  ) {
    super(platformId, sanitizer);
  }

  setLoginFirebaseAnalyticsParameter(user: any): Observable<User> {
    throw new Error('Method not implemented.');
  }
  setNewGameFirebaseAnalyticsParameter(gameOptions: GameOptions, userId: string, gameId: string): Observable<string> {
    throw new Error('Method not implemented.');
  }
  setEndGameFirebaseAnalyticsParameter(game: Game, userId: string, otherUserId: string): Observable<string> {
    throw new Error('Method not implemented.');
  }

  setUserLocationFirebaseAnalyticsParameter(user: User, isLocationChanged: boolean): Observable<string> {
    throw new Error('Method not implemented.');
  }

}
