import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

import { AppStore } from '../../core/store/app-store';
import { User, Game } from '../../model';

@Component({
  selector: 'game-invite',
  templateUrl: './game-invite.component.html',
  styleUrls: ['./game-invite.component.scss']
})
export class GameInviteComponent { // implements OnInit  {
  @Input() game: number;  //change this to game
/*  
  user: User;
  myTurn: boolean;

  constructor(private store: Store<AppStore>) { }

  ngOnInit() {
    this.store.take(1).subscribe(s => {
      this.user = s.user
      this.myTurn = this.game.nextTurnPlayerId === this.user.userId;
    }); //logged in user
  }
*/
}
