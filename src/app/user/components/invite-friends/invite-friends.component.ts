import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { InviteFriendsDialogComponent } from './invite-friends-dialog/invite-friends-dialog.component';
import { User } from '../../../model';
import { Store } from '@ngrx/store';
import { AppState, appState } from '../../../store';
import * as useractions from '../../../user/store/actions';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-invite-friends',
  templateUrl: './invite-friends.component.html',
  styleUrls: ['./invite-friends.component.scss']
})
export class InviteFriendsComponent implements OnInit, OnDestroy {

  dialogRef: MatDialogRef<InviteFriendsDialogComponent>;
  displayedColumns = ['friends', 'game_played', 'categories',
    'won', 'lost'];
  uFriends: Array<string>;
  userDict$: Observable<{ [key: string]: User }>;
  userDict: { [key: string]: User } = {};
  dataSource: any;

  constructor(public dialog: MatDialog, private renderer: Renderer2, private store: Store<AppState>, ) {
    this.userDict$ = this.store.select(appState.coreState).select(s => s.userDict);
    this.userDict$.subscribe(userDict => this.userDict = userDict);
    this.store.select(appState.coreState).select(s => s.user).subscribe(user => {
      if (user) {
        this.store.dispatch(new useractions.LoadUserFriends({ 'userId': user.userId }));
      }
    });
    this.store.select(appState.userState).select(s => s.userFriends).subscribe(uFriends => {
      if (uFriends !== null) {
        this.uFriends = [];
        uFriends.myFriends.map(friend => {
          this.uFriends = [...this.uFriends, ...Object.keys(friend)];

        });
        // console.log(JSON.stringify(this.uFriends));
        this.dataSource = new MatTableDataSource<any>(this.uFriends);
      }
      // console.log(JSON.stringify(this.uFriends));
    });

  }

  ngOnInit() {

  }

  inviteMoreFriend() {
    setTimeout(() => this.openDialog(), 0);
  }

  openDialog() {
    this.dialogRef = this.dialog.open(InviteFriendsDialogComponent, {
      disableClose: false
    });
    this.dialogRef.componentInstance.ref = this.dialogRef;

    this.dialogRef.afterOpen().subscribe(x => {
      this.renderer.addClass(document.body, 'dialog-open');
    });
    this.dialogRef.afterClosed().subscribe(x => {
      this.renderer.removeClass(document.body, 'dialog-open');
    });
  }
  ngOnDestroy() {
    (this.dialogRef) ? this.dialogRef.close() : '';
  }

}
