import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

import { AppStore } from '../../../core/store/app-store';
import { User, Game } from '../../../model';

@Component({
  selector: 'game-card',
  templateUrl: './game-card.component.html',
  styleUrls: ['./game-card.component.scss']
})
export class GameCardComponent implements OnInit  {
  @Input() game: Game;
  
  user: User;
  myTurn: boolean;

  constructor(private store: Store<AppStore>) { }

  ngOnInit() {
    this.store.take(1).subscribe(s => {
      this.user = s.user
      this.myTurn = this.game.nextTurnPlayerId === this.user.userId;
    }); //logged in user
  }

}
