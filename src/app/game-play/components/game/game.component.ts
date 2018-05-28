import { Component, Input, OnInit, OnDestroy, ViewChild, Renderer2 } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';
import '../../../rxjs-extensions';

import { AppState, appState } from '../../../store';

import { GameDialogComponent } from '../game-dialog/game-dialog.component';
import { GameQuestionComponent } from '../game-question/game-question.component';
import { GameActions } from '../../../core/store/actions';
import { Utils } from '../../../core/services';
import {
  Game, GameOptions, GameMode, PlayerQnA,
  User, Question, Category
} from '../../../model';
import * as gameplayactions from '../../store/actions';


@Component({
  selector: 'game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit, OnDestroy {
  user: User;
  subs: Subscription[] = [];
  dialogRef: MatDialogRef<GameDialogComponent>;
  userDict$: Observable<{ [key: string]: User }>;
  userDict: { [key: string]: User } = {};

  constructor(private store: Store<AppState>,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private renderer: Renderer2) {

    this.userDict$ = store.select(appState.coreState).select(s => s.userDict);
    this.subs.push(this.userDict$.subscribe(userDict => this.userDict = userDict));

  }

  ngOnInit() {
    this.store.select(appState.coreState).take(1).subscribe(s => this.user = s.user); //logged in user
    //use the setTimeout to avoid ExpressionChangedAfterItHasBeenCheckedError
    //The error happens as bindings change after change detection has run. using setTimeout runs another round of CD
    // REF: https://github.com/angular/angular/issues/6005
    // REF: https://github.com/angular/angular/issues/17572
    // REF: https://github.com/angular/angular/issues/10131
    //TODO: se what's causing the error and fix.
    setTimeout(() => this.openDialog(), 0);


  }

  openDialog() {
    this.dialogRef = this.dialog.open(GameDialogComponent, {
      disableClose: false,
      data: { 'user': this.user, 'userDict': this.userDict }
    });

    this.dialogRef.afterOpen().subscribe(x => {
      this.renderer.addClass(document.body, 'dialog-open');
    });
    this.dialogRef.afterClosed().subscribe(x => {
      this.renderer.removeClass(document.body, 'dialog-open');
    });
  }
  ngOnDestroy() {
    if (this.dialogRef) {
      this.dialogRef.close();
      this.store.dispatch(new gameplayactions.ResetCurrentGame());
      this.store.dispatch(new gameplayactions.ResetCurrentQuestion());
    }
    Utils.unsubscribe(this.subs);
  }
}
