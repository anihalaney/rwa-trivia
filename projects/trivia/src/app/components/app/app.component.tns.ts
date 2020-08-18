import { Component, OnInit, NgZone, OnDestroy, ChangeDetectorRef, ViewContainerRef, ViewChild, AfterViewInit } from '@angular/core';

import * as firebase from 'nativescript-plugin-firebase';
import { Store, select } from '@ngrx/store';
import { filter } from 'rxjs/operators';
import { AppState, appState } from '../../store';
import * as gamePlayActions from '../../game-play/store/actions';
import { RouterExtensions } from 'nativescript-angular/router';
import * as Platform from 'tns-core-modules/platform';
import * as application from 'tns-core-modules/application';
import { isAndroid } from 'tns-core-modules/platform';
import { android, AndroidActivityBackPressedEventData, AndroidApplication } from 'tns-core-modules/application';
import { NavigationService } from 'shared-library/core/services/mobile';
import { coreState } from 'shared-library/core/store';
import { ApplicationSettings } from 'shared-library/shared/model';
import { on as applicationOn, resumeEvent, ApplicationEventData } from 'tns-core-modules/application';
import { FirebaseAuthService } from 'shared-library/core/auth/firebase-auth.service';
import { ApplicationSettingsActions, CategoryActions } from 'shared-library/core/store/actions';
import { AutoUnsubscribe } from 'shared-library/shared/decorators';
import * as util from 'tns-core-modules/utils/utils';
import { alert } from 'tns-core-modules/ui/dialogs/dialogs';
import { projectMeta } from 'shared-library/environments/environment';
import * as appversion from 'nativescript-appversion';
import { Utils } from 'shared-library/core/services';
import { NavigationEnd, Router } from '@angular/router';
import { FirebaseScreenNameConstants, User } from 'shared-library/shared/model';
import { registerElement } from 'nativescript-angular/element-registry';
import { Carousel, CarouselItem } from 'nativescript-carousel';
import { ModalDialogOptions, ModalDialogService } from 'nativescript-angular/modal-dialog';
import { WelcomeScreenComponent } from 'shared-library/shared/mobile/component';
import * as appSettingsStorage from 'tns-core-modules/application-settings';
import { TopicActions } from 'shared-library/core/store/actions';
import { RadSideDrawerComponent, SideDrawerType } from 'nativescript-ui-sidedrawer/angular';


registerElement('Carousel', () => Carousel);
registerElement('CarouselItem', () => CarouselItem);

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})

@AutoUnsubscribe({ 'arrayName': 'subscriptions' })
export class AppComponent implements OnInit, OnDestroy, AfterViewInit {
  user: User;
  subscriptions = [];
  applicationSettings: ApplicationSettings;
  isDrawerOpenOrClosed = '';
  showBottomBar: Boolean = true;
  currentRouteUrl: string;
  bottomSafeArea: number;
  @ViewChild(RadSideDrawerComponent, { static: true }) public drawerComponent: RadSideDrawerComponent;
  private _drawer: SideDrawerType;
  constructor(
    private store: Store<AppState>,
    private navigationService: NavigationService,
    private ngZone: NgZone,
    private routerExtension: RouterExtensions,
    private firebaseAuthService: FirebaseAuthService,
    private applicationSettingsAction: ApplicationSettingsActions,
    private categoryActions: CategoryActions,
    private utils: Utils,
    private cd: ChangeDetectorRef,
    private router: Router,
    private _modalService: ModalDialogService,
    private _vcRef: ViewContainerRef,
    private topicsActions: TopicActions
  ) {
    this.bottomSafeArea = 120;
    this.handleBackPress();
  }

  ngOnInit() {

    this.checkForceUpdate();
    if (application.ios && application.ios.window.safeAreaInsets) {
      const bottomSafeArea: number = application.ios.window.safeAreaInsets.bottom;

      this.bottomSafeArea = bottomSafeArea > 0 ? this.bottomSafeArea + bottomSafeArea : this.bottomSafeArea;
    }
    firebase.init({
      onMessageReceivedCallback: (message) => {
        if (message.foreground) {
          this.utils.showMessage('success', message.body);
        } else {
          // only redirect to dashboard when notification is clicked from background
          // While app is foreground user may be playing game
          this.ngZone.run(() => this.navigationService.redirectPushRoutes(message.data));
        }
      },
      showNotifications: true,
      showNotificationsWhenInForeground: true
    }).then(
      () => {
        console.log('firebase.init done');
        this.store.dispatch(this.applicationSettingsAction.loadApplicationSettings());
        this.store.dispatch(this.topicsActions.loadTopTopics());
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

    application.on(application.uncaughtErrorEvent, (args) => {
      this.utils.sendErrorToCrashlytics('uncaughtException', args.error);
      console.error(args.error);
    });


    this.subscriptions.push(this.store.select(coreState).pipe(select(s => s.newGameId), filter(g => g !== '')).subscribe(gameObj => {
      // console.log('gameObj', gameObj);
      this.routerExtension.navigate(['/game-play', gameObj['gameId']], { clearHistory: true });
      this.store.dispatch(new gamePlayActions.ResetCurrentQuestion());
      this.cd.markForCheck();
    }));

    this.subscriptions.push(this.store.select(coreState).pipe(select(s => s.userProfileSaveStatus)).subscribe(status => {
      if (status === 'MAKE FRIEND SUCCESS') {
        this.routerExtension.navigate(['user/my/invite-friends']);
      }
    }));

    this.subscriptions.push(this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }

      this.currentRouteUrl = evt.url;

      this.showBottomBar = this.hideBottomBarForSelectedRoutes(evt.url);

      switch (evt.urlAfterRedirects) {
        case '/login':
          this.utils.setScreenNameInFirebaseAnalytics(FirebaseScreenNameConstants.LOGIN);
          break;
        case '/privacy-policy':
          this.utils.setScreenNameInFirebaseAnalytics(FirebaseScreenNameConstants.PRIVACY_POLICY);
          break;
        case '/recent-game':
          this.utils.setScreenNameInFirebaseAnalytics(FirebaseScreenNameConstants.RECENT_COMPLETED_GAMES);
          break;
        case '/dashboard':
          this.utils.setScreenNameInFirebaseAnalytics(FirebaseScreenNameConstants.DASHBOARD);
          break;
        case '/dashboard/leaderboard/':
          this.utils.setScreenNameInFirebaseAnalytics(FirebaseScreenNameConstants.LEADERBOARD);
          break;
        case '/game-play':
          this.utils.setScreenNameInFirebaseAnalytics(FirebaseScreenNameConstants.NEW_GAME);
          break;
        case '/user/my/invite-friends':
          this.utils.setScreenNameInFirebaseAnalytics(FirebaseScreenNameConstants.FRIEND_LIST);
          break;
        case ' /user/my/questions':
          this.utils.setScreenNameInFirebaseAnalytics(FirebaseScreenNameConstants.MY_QUESTIONS);
          break;
        case '/user/profile/':
          this.utils.setScreenNameInFirebaseAnalytics(FirebaseScreenNameConstants.PROFILE_SETTINGS);
          break;
        case '/user/my/questions/add':
          this.utils.setScreenNameInFirebaseAnalytics(FirebaseScreenNameConstants.QUESTION_ADD_UPDATE);
          break;
      }

    }));

    this.subscriptions.push(this.store.select(appState.coreState).pipe(select(s => s.user)).subscribe(user => {
      this.user = user;
      this.store.dispatch(this.applicationSettingsAction.loadApplicationSettings());
      this.store.dispatch(this.categoryActions.loadCategories());
    }));
  }

  ngAfterViewInit() {
    this._drawer = this.drawerComponent.sideDrawer;
    if (this._drawer.ios) {
      this._drawer.ios.defaultSideDrawer.style.shadowMode = 2;
      this._drawer.ios.defaultSideDrawer.style.shadowOpacity = 0.1; // 0-1, higher is darker
      this._drawer.ios.defaultSideDrawer.style.shadowRadius = 15; // higher is more spread
    }
  }

  drawerEvent(args) {
    this.isDrawerOpenOrClosed = args.eventName;
  }

  hideBottomBarForSelectedRoutes(url) {

    if (url === '/signup-extra-info' || url === '/select-category-tag' || url === '/first-question' ||
      ((url.includes('user/my/profile')) && Platform.isIOS) ||
      ((url.includes('user/my/questions')) && Platform.isIOS) ||
      url === '/login' ||
      url.includes('game-play')) {
      return false;
    } else {
      return true;
    }
  }

  async showWelcomeScreen() {
    try {
      if (!appSettingsStorage.getBoolean('isWelcomeScreenSeen', false)) {
        const options: ModalDialogOptions = {
          viewContainerRef: this._vcRef,
          context: {},
          fullscreen: true
        };

        await this._modalService.showModal(WelcomeScreenComponent, options);
        this.cd.markForCheck();
        appSettingsStorage.setBoolean('isWelcomeScreenSeen', true);
      }
    } catch (error) {
      console.error(error);
    }

  }

  async checkForceUpdate() {

    let version;
    try {
      version = await appversion.getVersionCode();
    } catch (error) {
      this.utils.sendErrorToCrashlytics('appLog', error);
      console.error(error);
    }

    this.subscriptions.push(this.store.select(appState.coreState).pipe(select(s => s.applicationSettings))
      .subscribe(appSettings => {

        if (appSettings && appSettings.length > 0) {

          this.applicationSettings = appSettings[0];
          //   console.log('appSettings', this.applicationSettings.crashlytics);
          if (isAndroid && version && this.applicationSettings.android_version
            && this.applicationSettings.android_version > version) {
            this.displayForceUpdateDialog(projectMeta.playStoreUrl);
          } else if (!isAndroid && version && this.applicationSettings.ios_version
            && this.applicationSettings.ios_version > version) {
            this.displayForceUpdateDialog(projectMeta.appStoreUrl);
          }
          if (this.applicationSettings.show_welcome_screen) {
            // this.showWelcomeScreen();
          }

        }
        this.cd.markForCheck();
      }));


  }

  async displayForceUpdateDialog(url: string) {

    const alertOptions = {
      title: 'New version available',
      message: 'New version available, please update to new version to continue.',
      okButtonText: 'Update',
      cancelable: false
    };
    try {
      await alert(alertOptions);
      util.openUrl(url);
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
      if (this.currentRouteUrl === '/dashboard') {
        data.cancel = false;
      } else {
        data.cancel = true;
        this.ngZone.run(() => this.navigationService.back());
      }
    }, this);
  }
}
