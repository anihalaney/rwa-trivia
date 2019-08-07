import { Component, OnInit, OnDestroy, Renderer2, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { InviteFriendsDialogComponent } from './invite-friends-dialog/invite-friends-dialog.component';
import { User } from 'shared-library/shared/model';
import { Utils } from 'shared-library/core/services';
import { AppState, appState } from '../../../store';
import { Store, select } from '@ngrx/store';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { Observable, Subscription } from 'rxjs';
import { UserActions } from 'shared-library/core/store/actions';
import { InviteFriends } from './invite-friends';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';

@Component({
  selector: 'app-invite-friends',
  templateUrl: './invite-friends.component.html',
  styleUrls: ['./invite-friends.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

@AutoUnsubscribe({ 'arrayName': 'subscriptions' })
export class InviteFriendsComponent extends InviteFriends implements OnInit, OnDestroy {

  dialogRef: MatDialogRef<InviteFriendsDialogComponent>;
  displayedColumns = ['friends', 'game_played',
    'won', 'lost'];
  uFriends: Array<any>;
  dataSource: any;
  subscriptions = [];
  defaultAvatar = 'assets/images/default-avatar.png';

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(public dialog: MatDialog,
    public store: Store<AppState>,
    public renderer: Renderer2,
    public userActions: UserActions,
    public utils: Utils,
    public cd: ChangeDetectorRef) {
    super(store, userActions, utils, cd);
  }

  ngOnInit() {
    this.subscriptions.push(this.store.select(appState.coreState).pipe(select(s => s.userFriends)).subscribe((uFriends: any) => {
      if (uFriends !== null && uFriends !== undefined) {
        this.uFriends = [];

        uFriends.map(friend => {
          this.uFriends.push(friend);
        });
        this.dataSource = new MatTableDataSource<any>(uFriends);
        this.setPaginatorAndSort();
      }
    }));
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

    this.subscriptions.push(this.dialogRef.afterOpen().subscribe(x => {
      this.renderer.addClass(document.body, 'dialog-open');
    }));
    this.subscriptions.push(this.dialogRef.afterClosed().subscribe(x => {
      this.renderer.removeClass(document.body, 'dialog-open');
    }));
  }

  ngOnDestroy() {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
  }

}
