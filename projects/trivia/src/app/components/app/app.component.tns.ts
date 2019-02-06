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
import { android, AndroidActivityBackPressedEventData, AndroidApplication } from 'application';
import { NavigationService } from 'shared-library/core/services/mobile/navigation.service'
import { coreState } from 'shared-library/core/store';
import { Utils } from 'shared-library/core/services';
import { User } from 'shared-library/shared/model';
import * as Toast from 'nativescript-toast';
import { on as applicationOn, resumeEvent, ApplicationEventData } from 'tns-core-modules/application';
import { FirebaseAuthService } from '../../../../../shared-library/src/lib/core/auth/firebase-auth.service';
import { ApplicationSettingsActions } from 'shared-library/core/store/actions';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})

export class AppComponent implements OnInit, OnDestroy {

  sub3: Subscription;
  sub4: Subscription;
  sub5: Subscription;

  constructor(private store: Store<AppState>,
    private navigationService: NavigationService,
    private ngZone: NgZone,
    private routerExtension: RouterExtensions,
    private utils: Utils,
    private userActions: UserActions,
    private firebaseAuthService: FirebaseAuthService,
    private applicationSettingsAction: ApplicationSettingsActions) {


    this.sub3 = this.store.select(coreState).pipe(select(s => s.newGameId), filter(g => g !== '')).subscribe(gameObj => {
      this.routerExtension.navigate(['/game-play', gameObj['gameId']]);
      this.store.dispatch(new gamePlayActions.ResetCurrentQuestion());
    });

    this.sub4 = this.store.select(coreState).pipe(select(s => s.userProfileSaveStatus)).subscribe(status => {
      if (status === 'MAKE FRIEND SUCCESS') {
        this.routerExtension.navigate(['my/invite-friends']);
      }
    });

    this.handleBackPress();
  }

  ngOnInit() {

    firebase.init({
      onMessageReceivedCallback: (message) => {
        console.log('message', message);
        if (message.foreground) {
          Toast.makeText(message.body).show();
        }
        this.ngZone.run(() => this.navigationService.redirectPushRoutes(message.data));
      },
      showNotifications: true,
      showNotificationsWhenInForeground: true
    }).then(
      () => {
        console.log('firebase.init done');
        this.store.dispatch(this.applicationSettingsAction.loadApplicationSettings());
      },
      error => {
        console.log(`firebase.init error: ${error}`);
        this.store.dispatch(this.applicationSettingsAction.loadApplicationSettings());
      }
    );

    applicationOn(resumeEvent, (args: ApplicationEventData) => {
      firebase.getCurrentUser().then((user) => {
        this.firebaseAuthService.resumeState(user);
      });
    });

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

