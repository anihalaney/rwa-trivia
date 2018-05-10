import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { InviteFriendsDialogComponent } from './invite-friends-dialog/invite-friends-dialog.component';

@Component({
  selector: 'app-invite-friends',
  templateUrl: './invite-friends.component.html',
  styleUrls: ['./invite-friends.component.scss']
})
export class InviteFriendsComponent implements OnInit, OnDestroy {

  dialogRef: MatDialogRef<InviteFriendsDialogComponent>;

  constructor(public dialog: MatDialog, private renderer: Renderer2) { }

  ngOnInit() {
    setTimeout(() => this.openDialog(), 0);
  }

  openDialog() {
    this.dialogRef = this.dialog.open(InviteFriendsDialogComponent, {
      disableClose: false
    });

    // this.dialogRef.afterOpen().subscribe(x => { window.document.body.classList.add('dialog-open') });
    // this.dialogRef.afterClosed().subscribe(x => { window.document.body.classList.remove('dialog-open') });
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
