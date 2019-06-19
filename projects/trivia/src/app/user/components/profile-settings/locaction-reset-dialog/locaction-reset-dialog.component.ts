import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { User } from 'shared-library/shared/model';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';

@Component({
  selector: 'app-locaction-reset-dialog',
  templateUrl: './locaction-reset-dialog.component.html',
  styleUrls: ['./locaction-reset-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

@AutoUnsubscribe({ 'arrayName': 'subscriptions' })
export class LocactionResetDialogComponent implements OnInit, OnDestroy {

  user: User;
  navLinks = [];
  ref: any;
  subscriptions = [];

  constructor() {
  }

  ngOnInit() {

  }

  closeModel() {
    this.ref.close();
  }

  ngOnDestroy() {

  }
}
