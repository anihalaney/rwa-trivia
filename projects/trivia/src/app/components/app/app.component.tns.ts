import { Component, OnInit, NgZone, OnDestroy } from '@angular/core';
import * as firebase from 'nativescript-plugin-firebase';
import { Store, select } from '@ngrx/store';
import { filter } from 'rxjs/operators';
import { AppState, appState } from '../../store';
import * as gamePlayActions from '../../game-play/store/actions';
import { RouterExtensions } from 'nativescript-angular/router';
import * as Platform from 'platform';
import { isAndroid } from 'tns-core-modules/platform';
import { android, AndroidActivityBackPressedEventData, AndroidApplication } from 'application';
import { NavigationService } from 'shared-library/core/services/mobile/navigation.service'
import { coreState } from 'shared-library/core/store';
import { ApplicationSettings } from 'shared-library/shared/model';
import * as Toast from 'nativescript-toast';
import { on as applicationOn, resumeEvent, ApplicationEventData } from 'tns-core-modules/application';
import { FirebaseAuthService } from 'shared-library/core/auth/firebase-auth.service';
import { ApplicationSettingsActions } from 'shared-library/core/store/actions';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import * as utils from 'tns-core-modules/utils/utils';
import { alert } from 'tns-core-modules/ui/dialogs/dialogs';
import { CONFIG } from '../../../../../shared-library/src/lib/environments/environment';
import * as appversion from 'nativescript-appversion';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})

@AutoUnsubscribe({ 'arrayName': 'subscriptions' })
export class AppComponent implements OnInit, OnDestroy {

  subscriptions = [];
  applicationSettings: ApplicationSettings;

  constructor(private store: Store<AppState>,
    private navigationService: NavigationService,
    private ngZone: NgZone,
    private routerExtension: RouterExtensions,
    private firebaseAuthService: FirebaseAuthService,
    private applicationSettingsAction: ApplicationSettingsActions) {

    this.checkForceUpdate();

    this.subscriptions.push(this.store.select(coreState).pipe(select(s => s.newGameId), filter(g => g !== '')).subscribe(gameObj => {
      this.routerExtension.navigate(['/game-play', gameObj['gameId']]);
      this.store.dispatch(new gamePlayActions.ResetCurrentQuestion());
    }));

    this.subscriptions.push(this.store.select(coreState).pipe(select(s => s.userProfileSaveStatus)).subscribe(status => {
      if (status === 'MAKE FRIEND SUCCESS') {
        this.routerExtension.navigate(['user/my/invite-friends']);
      }
    }));

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

  async checkForceUpdate() {

    let androidVersion;
    let iosVersion;

    try {
      if (isAndroid) {
        androidVersion = await appversion.getVersionName();
      } else {
        iosVersion = await appversion.getAppId();
      }
    } catch (error) {
      console.error(error);
    }

    this.subscriptions.push(this.store.select(appState.coreState).pipe(select(s => s.applicationSettings))
      .subscribe(appSettings => {
        if (appSettings && appSettings.length > 0) {

          this.applicationSettings = appSettings[0];

          if (isAndroid && androidVersion && this.applicationSettings.android_version
            && this.applicationSettings.android_version > androidVersion) {

            this.displayForceUpdateDialog(CONFIG.firebaseConfig.googlePlayUrl);

          } else if (!isAndroid && iosVersion && this.applicationSettings.ios_version
            && this.applicationSettings.ios_version > iosVersion) {

            this.displayForceUpdateDialog(CONFIG.firebaseConfig.iTunesUrl);

          }
        }
      }));
  }

  async displayForceUpdateDialog(url: string) {

    const alertOptions = {
      title: 'New version available',
      message: 'Please, update app to new version to continue reposting.',
      okButtonText: 'Update',
      cancelable: false
    };
    try {
      await alert(alertOptions);
      utils.openUrl(url);
    } catch (error) {
      console.error(error);
    }
  }

  ngOnDestroy() { }

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

