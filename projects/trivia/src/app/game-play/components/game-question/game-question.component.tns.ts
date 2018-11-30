import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { User } from 'shared-library/shared/model';
import { Utils } from 'shared-library/core/services';
import { GameQuestion } from './game-question';
import { Store, select } from '@ngrx/store';
import { GamePlayState } from '../../store';
import { appState } from '../../../store';
import { Observable } from 'rxjs';

@Component({
  selector: 'game-question',
  templateUrl: './game-question.component.html',
  styleUrls: ['./game-question.component.scss']
})
export class GameQuestionComponent extends GameQuestion implements OnInit, OnDestroy {

  @Input() user: User;

  answeredIndex: number;
  correctAnswerIndex: number;
  minutes = 1;
  public progressValue: number;
  stopProcessBar;
  columns;
  doPlay = true;
  photoUrl: String = '~/assets/icons/icon-192x192.png';
  userDict$: Observable<{ [key: string]: User }>;

  constructor(private utils: Utils, public store: Store<GamePlayState>, ) {
    super();
    this.userDict$ = store.select(appState.coreState).pipe(select(s => s.userDict));

  }

  ngOnInit() {
    this.progressValue = 0;
    this.stopProcessBar = setInterval(() => {
      if (this.progressValue <= 100 && this.doPlay) {
        this.progressValue = (this.minutes * 100) / 15;
        this.minutes++;
      } else {
        this.clearProcessBar();
      }
    }, 1000);
    this.photoUrl = this.utils.getImageUrl(this.user, 70, 60, '70X60');
  }


  ngOnDestroy() {
    this.clearProcessBar();
  }

  clearProcessBar() {
    clearInterval(this.stopProcessBar);
  }

  fillTimer() {
    clearInterval(this.stopProcessBar);
  }

  getImage(userId) {
    return this.utils.getImageUrl(this.userDict[userId], 44, 40, '44X40');
  }
}
