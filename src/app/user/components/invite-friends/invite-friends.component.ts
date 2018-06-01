import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { InviteFriendsDialogComponent } from './invite-friends-dialog/invite-friends-dialog.component';
import { User } from '../../../model';
import { Store } from '@ngrx/store';
import { AppState, appState } from '../../../store';
import * as useractions from '../../../user/store/actions';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { UserActions } from '../../../core/store/actions';

@Component({
  selector: 'app-invite-friends',
  templateUrl: './invite-friends.component.html',
  styleUrls: ['./invite-friends.component.scss']
})
export class InviteFriendsComponent implements OnInit, OnDestroy {

  dialogRef: MatDialogRef<InviteFriendsDialogComponent>;
  displayedColumns = ['friends', 'game_played',
    'won', 'lost'];
  uFriends: Array<any>;
  userDict$: Observable<{ [key: string]: User }>;
  userDict: { [key: string]: User } = {};
  dataSource: any;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(public dialog: MatDialog, private store: Store<AppState>, private userActions: UserActions) {
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
        uFriends.myFriends.map((friend, index) => {
          this.store.dispatch(this.userActions.loadOtherUserProfile(Object.keys(friend)[0]));
          this.uFriends.push(friend[Object.keys(friend)[0]]);
          this.uFriends[index].userId = Object.keys(friend)[0];
        });
        this.dataSource = new MatTableDataSource<any>(this.uFriends);
        this.setPaginatorAndSort();
      }
    });
  }

  ngOnInit() {

  }

  setPaginatorAndSort() {
    this.dataSource.paginator = this.paginator;
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
