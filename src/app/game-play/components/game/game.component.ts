import { Component, Input, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';
import '../../../rxjs-extensions';

import { AppStore } from '../../../core/store/app-store';

import { GameDialogComponent } from '../game-dialog/game-dialog.component';
import { GameQuestionComponent } from '../game-question/game-question.component';
import { GameActions } from '../../../core/store/actions';
import { Utils } from '../../../core/services';
import { Game, GameOptions, GameMode, PlayerQnA,
         User, Question, Category } from '../../../model';

@Component({
  selector: 'game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit, OnDestroy {
  gameId: string;
  user: User;

  dialogRef: MatDialogRef<GameDialogComponent>;

  constructor(private store: Store<AppStore>,
              public dialog: MatDialog, 
              private route: ActivatedRoute, 
              private router: Router) { }

  ngOnInit() {
    this.store.take(1).subscribe(s => this.user = s.user); //logged in user

    this.route.params.subscribe((params: Params) => { 
      this.gameId = params['id'] ;
      //this.openDialog();
      
      //use the setTimeout to avoid ExpressionChangedAfterItHasBeenCheckedError
      //The error happens as bindings change after change detection has run. using setTimeout runs another round of CD
      // REF: https://github.com/angular/angular/issues/6005
      // REF: https://github.com/angular/angular/issues/17572
      // REF: https://github.com/angular/angular/issues/10131
      //TODO: se what's causing the error and fix.
      setTimeout(() => this.openDialog(), 0);
    });

  }

  openDialog() {
    console.log("openDialog");
    this.dialogRef = this.dialog.open(GameDialogComponent, {
      disableClose: true,
      data: { "gameId": this.gameId, "user": this.user }
    });
  }
  ngOnDestroy() {
    if (this.dialogRef)
      this.dialogRef.close();
  }
}
