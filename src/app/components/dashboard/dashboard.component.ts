import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';

import { AppStore, categoryDictionary } from '../../core/store/app-store';
import { Utils } from '../../core/services';
import { QuestionActions, GameActions } from '../../core/store/actions';
import { User, Category, Question, SearchResults, Game } from '../../model';

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss', './dashboard.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  user: User;
  sub: Subscription;
  
  questionOfTheDay$: Observable<Question>;
  activeGames$: Observable<Game[]>;
  gameInvites: number[];  //change this to game invites

  now: Date;
  greeting: string;
  message: string;
  
  constructor(private store: Store<AppStore>,
              private questionActions: QuestionActions,
              private gameActions: GameActions) {
    this.questionOfTheDay$ = store.select(s => s.questionOfTheDay);
    this.activeGames$ = store.select(s => s.activeGames);
    this.gameInvites = [1,2,3];

    this.sub = store.select(s => s.user).subscribe(user => {
      this.user = user
      if (user) {
        //Load active Games
        this.store.dispatch(this.gameActions.getActiveGames(user));
      }
    });
  }

  ngOnInit() {
    this.store.dispatch(this.questionActions.getQuestionOfTheDay());
    this.now = new Date();
    let hourOfDay = this.now.getHours();
    if (hourOfDay < 12) {
      this.greeting = "Morning";
      this.message = "Glad to see you. Start your day with a new challenge!"
    }
    else if (hourOfDay < 17) {
      this.greeting = "Afternoon";
      this.message = "Caught you napping? Jog your mind with a new challenge!"
    }
    else {
      this.greeting = "Evening";
      this.message = "Relax your mind. Spice it up with a new game!"
    }
  }

  ngOnDestroy() {
    Utils.unsubscribe([this.sub]);
  }
}
