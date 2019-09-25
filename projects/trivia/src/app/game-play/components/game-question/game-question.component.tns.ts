import { Component, Input, OnInit, OnDestroy, SimpleChanges, OnChanges, ChangeDetectionStrategy, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { User, FirebaseScreenNameConstants } from 'shared-library/shared/model';
import { Utils } from 'shared-library/core/services';
import { GameQuestion } from './game-question';
import { Store, select } from '@ngrx/store';
import { GamePlayState } from '../../store';
import { appState } from '../../../store';
import { Observable, timer, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { projectMeta } from 'shared-library/environments/environment';


@Component({
  selector: 'game-question',
  templateUrl: './game-question.component.html',
  styleUrls: ['./game-question.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

@AutoUnsubscribe({ 'arrayName': 'subscriptions' })
export class GameQuestionComponent extends GameQuestion implements OnInit, OnDestroy, OnChanges {


  subscriptions = [];
  answeredIndex: number;
  correctAnswerIndex: number;
  minutes = 0.62;
  public progressValue: number;
  stopProcessBar;
  columns;
  doPlay = true;
  actionText: string;

  photoUrl: String = `~/assets/icons/${projectMeta.projectName}/icon-192x192.png`;
  userDict$: Observable<{ [key: string]: User }>;
  processTimeInterval: number;
  elapsedTime: number;
  timerSub: Subscription;

  constructor(private utils: Utils, public store: Store<GamePlayState>, private cd: ChangeDetectorRef) {
    super();
    this.userDict$ = store.select(appState.coreState).pipe(select(s => s.userDict));
    this.actionText = 'Playing Now';
  }

  ngOnInit() {
    this.progressValue = 0;
    this.photoUrl = this.utils.getImageUrl(this.user, 70, 60, '70X60');

    this.cd.markForCheck();
  }

  ngOnDestroy() {
  }

  fillTimer() {
    if (this.answeredIndex === undefined) {
      this.progressValue = 100;
    }
  }

  getImage(userId) {
    return this.utils.getImageUrl(this.userDict[userId], 44, 40, '44X40');
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.continueNext && this.answeredIndex === undefined) {
      this.progressValue = 100;
    } else if (changes.timer) {
      this.timer = this.MAX_TIME_IN_SECONDS - changes.timer.currentValue;
      if (this.timerSub) {
        this.utils.unsubscribe([this.timerSub]);
      }
      this.progressValue = (this.timer * 100) / this.MAX_TIME_IN_SECONDS;

      this.timerSub =
        timer(0, 10).pipe(take(90)).subscribe(t => {
          this.timer += 0.010;
          this.progressValue = (this.timer / this.MAX_TIME_IN_SECONDS) * 100;
          this.cd.markForCheck();
        },
          null,
          () => {
            this.utils.unsubscribe([this.timerSub]);
          });
      this.subscriptions.push(this.timerSub);
    }
  }
}
