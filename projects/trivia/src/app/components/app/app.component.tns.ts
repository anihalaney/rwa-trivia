import { Component, OnInit, NgZone } from '@angular/core';
import * as firebase from 'nativescript-plugin-firebase';
import { Store, select } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AppState, appState } from '../../store';
import * as gamePlayActions from '../../game-play/store/actions';
import { RouterExtensions } from 'nativescript-angular/router';
import * as Platform from 'platform';
import {
  android, AndroidActivityBackPressedEventData, AndroidApplication,
  ApplicationEventData, off as applicationOff, on as applicationOn, resumeEvent
} from "application";
import { NavigationService } from 'shared-library/core/services/mobile/navigation.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})

export class AppComponent implements OnInit {

  sub3: Subscription;
  constructor(private store: Store<AppState>,
    private navigationService: NavigationService,
    private ngZone: NgZone,
    private routerExtension: RouterExtensions) {
    this.sub3 = this.store.select(appState.gamePlayState).pipe(select(s => s.newGameId), filter(g => g !== '')).subscribe(gameObj => {
      console.log('callled ');
      this.routerExtension.navigate(['/game-play', gameObj['gameId']]);
      this.store.dispatch(new gamePlayActions.ResetCurrentQuestion());
    });
    this.handleBackPress();
  }
  ngOnInit() {
    firebase.init({}).then((instance) => { });
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
