import { Component, OnInit } from '@angular/core';
import { Invitation, Category, userCardType, User } from 'shared-library/shared/model';
import { Store, select } from '@ngrx/store';
import { CoreState, coreState, categoryDictionary } from './../../../../core/store';
import { Observable, combineLatest } from 'rxjs';
@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {
  user: User;
  friendInvitations: Invitation[] = [];
  subscriptions = [];
  categoryDict$: Observable<{ [key: number]: Category }>;
  categoryDict: { [key: number]: Category };
  notifications = [];
  userCardType = userCardType;
  constructor(public store: Store<CoreState>) {
    this.categoryDict$ = store.select(categoryDictionary);
    this.subscriptions.push(this.categoryDict$.subscribe(categoryDict => this.categoryDict = categoryDict));
    this.subscriptions.push(this.store.select(coreState).pipe(select(s => s.user)).subscribe(user => {
      this.user = user;
    }));
    this.subscriptions.push(combineLatest(store.select(coreState).pipe(select(s => s.friendInvitations)),
      store.select(coreState).pipe(select(s => s.gameInvites))).subscribe((notify: any) => {
        this.notifications = notify[0].concat(notify[1]);
        this.notifications.sort((a, b) => {
          return b.createdAt - a.createdAt;
        });
      }));
  }

  ngOnInit() {
  }

}
