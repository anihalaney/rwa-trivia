import { Component, OnInit, NgZone, OnDestroy } from '@angular/core';
import * as firebase from 'nativescript-plugin-firebase';
import { Store, select } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { AppState, appState } from '../../store';
import * as gamePlayActions from '../../game-play/store/actions';
import { UserActions } from 'shared-library/core/store/actions';
import { RouterExtensions } from 'nativescript-angular/router';
import * as Platform from 'platform';
import { isAndroid } from 'tns-core-modules/platform';
import {
  android, AndroidActivityBackPressedEventData, AndroidApplication
} from 'application';
import { NavigationService } from 'shared-library/core/services/mobile/navigation.service'
import { coreState } from 'shared-library/core/store';
import { Utils } from 'shared-library/core/services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})

export class AppComponent implements OnInit, OnDestroy {

  sub3: Subscription;
  sub4: Subscription;
  sub5: Subscription;
  pushToken: string;

  constructor(private store: Store<AppState>,
    private navigationService: NavigationService,
    private ngZone: NgZone,
    private routerExtension: RouterExtensions,
    private utils: Utils,
    private userActions: UserActions) {

    this.sub3 = this.store.select(coreState).pipe(select(s => s.newGameId), filter(g => g !== '')).subscribe(gameObj => {
      this.routerExtension.navigate(['/game-play', gameObj['gameId']]);
      this.store.dispatch(new gamePlayActions.ResetCurrentQuestion());
    });

    this.sub4 = this.store.select(coreState).pipe(select(s => s.userProfileSaveStatus)).subscribe(status => {
      if (status === 'MAKE FRIEND SUCCESS') {
        this.routerExtension.navigate(['my/invite-friends']);
      }
    });

    this.sub5 = this.store.select(appState.coreState).pipe(select(s => s.user)).subscribe(user => {
      if (user && this.pushToken) {
        if (isAndroid) {
          console.log('Android this.pushToken-->', this.pushToken);
          user.androidPushTokens = (user.androidPushTokens) ? user.androidPushTokens : [];
          (user.androidPushTokens.indexOf(this.pushToken) === -1) ?
            user.androidPushTokens.push(this.pushToken) : '';
        } else {
          console.log('iOS this.pushToken-->', this.pushToken);
          user.iosPushTokens = (user.iosPushTokens) ? user.iosPushTokens : [];
          user.iosPushTokens.push(this.pushToken);
          (user.iosPushTokens.indexOf(this.pushToken) === -1) ?
            user.iosPushTokens.push(this.pushToken) : '';
        }
        console.log('user-->', user);
        this.store.dispatch(this.userActions.updateUser(user));
        this.pushToken = undefined;
      }
    });

    this.handleBackPress();
  }

  ngOnInit() {
    firebase.init({
      onPushTokenReceivedCallback: (token) => {
        console.log('Firebase push token: ' + token);
        this.pushToken = token;
      },
      onMessageReceivedCallback: (message) => {
        console.log('message', message);
      },
      showNotifications: true,
      showNotificationsWhenInForeground: true
    }).then(
      () => {
        console.log('firebase.init done');
      },
      error => {
        console.log(`firebase.init error: ${error}`);
      }
    );
  }

  ngOnDestroy() {
    this.utils.unsubscribe([this.sub3, this.sub4, this.sub5]);
  }


  handleBackPress() {
    if (!Platform.isAndroid) {
      return;
    }
    // every time app resume component is recreated
    // we want to ensure there is only one event listener in app
    android.off(AndroidApplication.activityBackPressedEvent);
    android.on(AndroidApplication.activityBackPressedEvent, (data: AndroidActivityBackPressedEventData) => {
      console.log(`can go back value${this.navigationService.canGoBack()}`);
      data.cancel = this.navigationService.canGoBack();
      this.ngZone.run(() => this.navigationService.back());
    }, this);
  }
}
