import { Component, OnInit, Input, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { User, userCardType, Invitation } from 'shared-library/shared/model';
import { Utils } from 'shared-library/core/services';
import { CoreState, coreState } from './../../../core/store';
import { Store, select } from '@ngrx/store';
import { filter } from 'rxjs/operators';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { UserActions } from '../../../core/store/actions';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.scss']
})
// @AutoUnsubscribe({ 'arrayName': 'subscriptions' })
export class UserCardComponent implements OnInit, OnDestroy {

  @Input() user: User;
  @Input() type: number;
  @Input() isGamePlay: boolean;
  @Input() invitation: Invitation;
  @Input() gameStatus: string;
  @Input() otherInfo: any;
  @Input() userId: string;
  loggedInUserId: string;
  userCardType = userCardType;
  subscriptions = [];
  userDict$: Observable<{ [key: string]: User }>;
  userDict: { [key: string]: User };

  constructor(private utils: Utils,
    private store: Store<CoreState>,
    private userActions: UserActions,
    protected cd: ChangeDetectorRef) {
    this.loggedInUserId = '';
  }

  ngOnInit() {

    this.userDict$ = this.store.select(coreState).pipe(select(s => s.userDict));

    this.subscriptions.push(this.userDict$.subscribe(userDict => {
      this.userDict = userDict;
      // console.log('dictionary updated', this.userDict);
      if (this.user) {
        if (userDict[this.userId] && this.user) {
          const isMatch = JSON.stringify(this.user).toLowerCase() === JSON.stringify(this.userDict[this.userId]).toLowerCase();
          if (!isMatch) {
            console.log(this.userDict[this.userId]);
            this.user = this.userDict[this.userId];
            this.cd.markForCheck();
          }
        }
      } else {
        this.user = this.userDict[this.userId];
        this.cd.markForCheck();
      }

    }));

    console.log('TYPE', this.type);
    this.subscriptions.push(this.store.select(coreState)
      .pipe(select(s => s.user)).subscribe(user => {
        this.loggedInUserId = (user) ? user.userId : '';
        // console.log('user calledd', this.userId, this.loggedInUserId);
        if (this.userId) {
          if (this.loggedInUserId) {
            // console.log('get extra info');
            // if()
            if (!this.userDict[this.userId] || !this.userDict[this.userId].account) {
              // console.log(this.userDict[this.userId]);
              console.log('user ID', this.userId);
              this.store.dispatch(this.userActions.loadOtherUserExtendedInfo(this.userId));
            }
          } else {
            if (this.userDict && !this.userDict[this.userId]) {
              console.log('user ID 70', this.userId);
              this.store.dispatch(this.userActions.loadOtherUserProfile(this.userId));
            }
            this.cd.markForCheck();
          }
        }

        this.cd.markForCheck();
      }));
  }


  getImageUrl(user: User, width, height) {
    return this.utils.getImageUrl(user, width, height, `${width}X${height}`);
  }

  ngOnDestroy(): void {

  }
}
