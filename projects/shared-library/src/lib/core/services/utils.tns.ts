import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Feedback, FeedbackType, FeedbackPosition } from 'nativescript-feedback';
import { UtilsCore } from './utilsCore';
import * as firebase from 'nativescript-plugin-firebase';
import { Observable } from 'rxjs';
import { User, GameOptions, Game } from '../../shared/model';

@Injectable()
export class Utils extends UtilsCore {


  private message: Feedback;
  private messageConfig = {
    position: FeedbackPosition.Bottom,
    duration: 3000,
    type: FeedbackType.Custom,
    message: ''
  };

  constructor(@Inject(PLATFORM_ID) public platformId: Object) {
    super(platformId);
    this.message = new Feedback();
  }

  showMessage(type: string, message: string) {
    switch (type) {
      case 'success':
        this.messageConfig.type = FeedbackType.Success;
        break;
      case 'error':
        this.messageConfig.type = FeedbackType.Error;
        break;
    }
    this.messageConfig.message = message;
    this.message.show(this.messageConfig);

  }

  sendErrorToCrashlytics(type: any, error: any) {
    firebase.crashlytics.log(type, error);
    firebase.crashlytics.sendCrashLog(error);
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
