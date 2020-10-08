import { Component, OnInit, OnDestroy } from '@angular/core';
import { Invitation, Category, userCardType, User } from 'shared-library/shared/model';
import { Store, select } from '@ngrx/store';
import { CoreState, coreState, categoryDictionary } from './../../../../core/store';
import { Observable, combineLatest } from 'rxjs';
import { AutoUnsubscribe } from 'shared-library/shared/decorators';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})

@AutoUnsubscribe({ 'arrayName': 'subscriptions' })
export class NotificationComponent implements OnInit, OnDestroy {

  user: User;
  friendInvitations: Invitation[] = [];
  subscriptions = [];
  categoryDict$: Observable<{ [key: number]: Category }>;
  categoryDict: { [key: number]: Category };
  notifications = [];
  userCardType = userCardType;
  constructor(public store: Store<CoreState>) {
  }

  ngOnInit() {
    this.categoryDict$ = this.store.select(categoryDictionary);
    this.subscriptions.push(this.categoryDict$.subscribe(categoryDict => this.categoryDict = categoryDict));
    this.subscriptions.push(this.store.select(coreState).pipe(select(s => s.user)).subscribe(user => {
      this.user = user;
    }));
    this.subscriptions.push(combineLatest(this.store.select(coreState).pipe(select(s => s.friendInvitations)),
      this.store.select(coreState).pipe(select(s => s.gameInvites))).subscribe((notify: any) => {

        if (notify[0] && notify[1]) {
          this.notifications = notify[0].concat(notify[1]);
          this.notifications.sort((a, b) => {
            return b.createdAt - a.createdAt;
          });
        }

      }));
  }

  ngOnDestroy(): void {
  }

}
