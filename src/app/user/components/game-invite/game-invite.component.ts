import { Component, Input, OnChanges } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { AppState, appState, categoryDictionary } from '../../../store';


import { User, Game, Category } from '../../../model';
import { gameInvites } from 'app/game-play/store';

@Component({
  selector: 'game-invite',
  templateUrl: './game-invite.component.html',
  styleUrls: ['./game-invite.component.scss']
})
export class GameInviteComponent implements OnChanges {

  @Input() userDict: { [key: string]: User } = {};
  @Input() game: Game;
  categoryDict$: Observable<{ [key: number]: Category }>;
  categoryDict: { [key: number]: Category };
  randomCategoryId = 0;


  constructor(private store: Store<AppState>) {
    this.categoryDict$ = store.select(categoryDictionary);
    this.categoryDict$.subscribe(categoryDict => this.categoryDict = categoryDict);
  }

  ngOnChanges() {
    this.randomCategoryId = Math.floor(Math.random() * this.game.gameOptions.categoryIds.length);
  }


}
