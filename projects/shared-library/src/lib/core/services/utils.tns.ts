import { Inject, Injectable, PLATFORM_ID } from "@angular/core";
import {
  Feedback,
  FeedbackPosition,
  FeedbackType
} from "nativescript-feedback";
import * as firebase from "nativescript-plugin-firebase";
import {
  Parameter,
  User,
  FirebaseAnalyticsKeyConstants,
  FirebaseAnalyticsEventConstants,
  GameOptions,
  PlayerMode,
  GameConstant,
  OpponentType,
  GameMode,
  Game,
  GeneralConstants
} from "../../shared/model";
import { of, Observable } from "rxjs";
import { UtilsCore } from "./utilsCore";
import { isAndroid } from "tns-core-modules/platform";
import { RouterExtensions } from "nativescript-angular/router";

@Injectable()
export class Utils extends UtilsCore {
  private message: Feedback;
  private messageConfig = {
    position: FeedbackPosition.Bottom,
    duration: 3000,
    type: FeedbackType.Custom,
    message: ""
  };

  constructor(
    @Inject(PLATFORM_ID) public platformId: Object,
    private routerExtensions: RouterExtensions
  ) {
    super(platformId);
    this.message = new Feedback();
  }

  showMessage(type: string, message: string) {
    switch (type) {
      case "success":
        this.messageConfig.type = FeedbackType.Success;
        break;
      case "error":
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

  setAnalyticsParameter(
    key: string,
    value: string,
    analyticsParameter: Array<Parameter>
  ): Array<Parameter> {
    analyticsParameter.push({ key: key, value: value });
    return analyticsParameter;
  }

  sendFirebaseAnalyticsEvents(
    eventName: string,
    analyticsParameter: Array<Parameter>
  ) {
    firebase.analytics
      .logEvent({
        key: eventName,
        parameters: analyticsParameter
      })
      .then(() => {
        console.log(`${eventName} event slogged`);
      });
  }

  setScreenNameInFirebaseAnalytics(screenName: string) {
    firebase.analytics
      .setScreenName({
        screenName: screenName
      })
      .then(function() {
        console.log(`${screenName} Screen is added`);
      });
  }

  setLoginFirebaseAnalyticsParameter(user: User): Observable<User> {
    let analyticsParameter: Parameter[] = [];

    analyticsParameter = this.setAnalyticsParameter(
      FirebaseAnalyticsKeyConstants.USER_ID,
      user.userId,
      analyticsParameter
    );

    this.sendFirebaseAnalyticsEvents(
      FirebaseAnalyticsEventConstants.USER_LOGIN,
      analyticsParameter
    );

    return of(user);
  }

  setNewGameFirebaseAnalyticsParameter(
    gameOptions: GameOptions,
    userId: string,
    gameId: string
  ): Observable<string> {
    let analyticsParameter: Parameter[] = [];

    analyticsParameter = this.setAnalyticsParameter(
      FirebaseAnalyticsKeyConstants.USER_ID,
      userId,
      analyticsParameter
    );
    analyticsParameter = this.setAnalyticsParameter(
      FirebaseAnalyticsKeyConstants.PLAYER_MODE,
      gameOptions.playerMode === PlayerMode.Single
        ? GameConstant.SINGLE
        : GameConstant.OPPONENT,
      analyticsParameter
    );

    analyticsParameter = this.setAnalyticsParameter(
      FirebaseAnalyticsKeyConstants.OPPONENT_TYPE,
      gameOptions.opponentType === OpponentType.Random
        ? GameConstant.RANDOM
        : gameOptions.opponentType === OpponentType.Friend
        ? GameConstant.FRIEND
        : GameConstant.COMPUTER,
      analyticsParameter
    );

    analyticsParameter = this.setAnalyticsParameter(
      FirebaseAnalyticsKeyConstants.GAME_MODE,
      gameOptions.gameMode === GameMode.Normal
        ? GameConstant.NORMAL
        : GameConstant.OFFLINE,
      analyticsParameter
    );

    analyticsParameter = this.setAnalyticsParameter(
      FirebaseAnalyticsKeyConstants.CATEGORY_IDS,
      JSON.stringify(gameOptions.categoryIds),
      analyticsParameter
    );

    const tagsValue = JSON.stringify(gameOptions.tags);
    analyticsParameter = this.setAnalyticsParameter(
      FirebaseAnalyticsKeyConstants.TAGS,
      tagsValue.substr(0, 100),
      analyticsParameter
    );

    this.sendFirebaseAnalyticsEvents(
      FirebaseAnalyticsEventConstants.START_NEW_GAME,
      analyticsParameter
    );

    return of(gameId);
  }

  setEndGameFirebaseAnalyticsParameter(
    game: Game,
    userId: string,
    otherUserId: string
  ): Observable<string> {
    let analyticsParameter: Parameter[] = [];

    analyticsParameter = this.setAnalyticsParameter(
      FirebaseAnalyticsKeyConstants.GAME_ID,
      game.gameId,
      analyticsParameter
    );
    analyticsParameter = this.setAnalyticsParameter(
      FirebaseAnalyticsKeyConstants.USER_ID,
      userId,
      analyticsParameter
    );
    analyticsParameter = this.setAnalyticsParameter(
      FirebaseAnalyticsKeyConstants.PLAYER_MODE,
      game.gameOptions.playerMode === PlayerMode.Single
        ? GameConstant.SINGLE
        : GameConstant.OPPONENT,
      analyticsParameter
    );

    if (game.gameOptions.playerMode === PlayerMode.Opponent) {
      analyticsParameter = this.setAnalyticsParameter(
        FirebaseAnalyticsKeyConstants.OPPONENT_TYPE,
        game.gameOptions.opponentType === OpponentType.Random
          ? GameConstant.RANDOM
          : game.gameOptions.opponentType === OpponentType.Friend
          ? GameConstant.FRIEND
          : GameConstant.COMPUTER,
        analyticsParameter
      );

      analyticsParameter = this.setAnalyticsParameter(
        FirebaseAnalyticsKeyConstants.OTHER_USER_ID,
        otherUserId,
        analyticsParameter
      );

      analyticsParameter = this.setAnalyticsParameter(
        FirebaseAnalyticsKeyConstants.OTHER_USER_SCORE,
        game.stats[otherUserId].score.toString(),
        analyticsParameter
      );

      if (
        game.round <= 16 &&
        (!game.gameOptions.isBadgeWithCategory && game.stats[userId].score === game.stats[otherUserId].score) ||
        (game.gameOptions.isBadgeWithCategory && game.stats[userId].badge.length === game.stats[otherUserId].badge.length)
      ) {
        analyticsParameter = this.setAnalyticsParameter(
          FirebaseAnalyticsKeyConstants.IS_TIE,
          GeneralConstants.TRUE,
          analyticsParameter
        );
      } else {
        let winPlayerId = otherUserId;
        if (
          game.round < 16 &&
          (!game.gameOptions.isBadgeWithCategory && game.stats[userId].score > game.stats[otherUserId].score) ||
          (game.gameOptions.isBadgeWithCategory && game.stats[userId].badge.length > game.stats[otherUserId].badge.length)
        ) {
          winPlayerId = userId;
        }
        analyticsParameter = this.setAnalyticsParameter(
          FirebaseAnalyticsKeyConstants.WINNER_PLAYER_ID,
          winPlayerId,
          analyticsParameter
        );
      }
    } else {
      analyticsParameter = this.setAnalyticsParameter(
        FirebaseAnalyticsKeyConstants.GAME_STATUS,
        game.playerQnAs.length - game.stats[userId].score !== 4
          ? GeneralConstants.WIN
          : GeneralConstants.LOST,
        analyticsParameter
      );
    }

    analyticsParameter = this.setAnalyticsParameter(
      FirebaseAnalyticsKeyConstants.USER_SCORE,
      game.stats[userId].score.toString(),
      analyticsParameter
    );

    analyticsParameter = this.setAnalyticsParameter(
      FirebaseAnalyticsKeyConstants.GAME_MODE,
      game.gameOptions.gameMode === GameMode.Normal
        ? GameConstant.NORMAL
        : GameConstant.OFFLINE,
      analyticsParameter
    );

    analyticsParameter = this.setAnalyticsParameter(
      FirebaseAnalyticsKeyConstants.CATEGORY_IDS,
      JSON.stringify(game.gameOptions.categoryIds),
      analyticsParameter
    );

    const tagsValue = JSON.stringify(game.gameOptions.tags);
    analyticsParameter = this.setAnalyticsParameter(
      FirebaseAnalyticsKeyConstants.TAGS,
      tagsValue.substr(0, 100),
      analyticsParameter
    );

    analyticsParameter = this.setAnalyticsParameter(
      FirebaseAnalyticsKeyConstants.ROUND,
      game.round.toString(),
      analyticsParameter
    );

    this.sendFirebaseAnalyticsEvents(
      FirebaseAnalyticsEventConstants.COMPLETED_GAME,
      analyticsParameter
    );

    return of("success");
  }

  setUserLocationFirebaseAnalyticsParameter(
    user: User,
    isLocationChanged: boolean
  ): Observable<string> {
    if (isLocationChanged) {
      let analyticsParameter: Parameter[] = [];

      analyticsParameter = this.setAnalyticsParameter(
        FirebaseAnalyticsKeyConstants.USER_ID,
        user.userId,
        analyticsParameter
      );
      analyticsParameter = this.setAnalyticsParameter(
        FirebaseAnalyticsKeyConstants.LOCATION,
        user.location,
        analyticsParameter
      );

      this.sendFirebaseAnalyticsEvents(
        FirebaseAnalyticsEventConstants.USER_LOCATION,
        analyticsParameter
      );
    }

    return of("success");
  }

  hideKeyboard(field) {
    if (isAndroid) {
      field.toArray().map(el => {
        el.nativeElement.android.clearFocus();
        return el.nativeElement.dismissSoftInput();
      });
    }
  }

  focusTextField(field) {
    setTimeout(() => {
      // Focus on textfield and set cursor on last character.
      field.nativeElement.focus();

      // Android doesn't put cursor on last last character.
      if (isAndroid) {
        field.nativeElement.focus();
        field.nativeElement.android.setSelection(
          field.nativeElement.text.length
        );
      }
    }, 5);
  }

  goToDashboard() {
    this.routerExtensions.navigate(["/dashboard"], { clearHistory: true });
  }
}
