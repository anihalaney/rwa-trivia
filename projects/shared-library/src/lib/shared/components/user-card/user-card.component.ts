import { Component, OnInit, Input, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy, NgZone, Output, EventEmitter, OnChanges } from '@angular/core';
import { User, userCardType, Invitation } from 'shared-library/shared/model';
import { Utils } from 'shared-library/core/services';
import { CoreState, coreState } from './../../../core/store';
import { Store, select } from '@ngrx/store';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { UserActions } from '../../../core/store/actions';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.scss'],
})
@AutoUnsubscribe({ 'arrayName': 'subscriptions' })
export class UserCardComponent implements OnInit, OnDestroy, OnChanges {

  @Input() user: User;
  @Input() type: number;
  @Input() isGamePlay: boolean;
  @Input() invitation: Invitation;
  @Input() gameStatus: string;
  @Input() otherInfo: any;
  @Input() userId: string;
  @Output() userChange = new EventEmitter();
  loggedInUserId: string;
  userCardType = userCardType;
  subscriptions = [];
  userDict$: Observable<{ [key: string]: User }>;
  userDict: { [key: string]: User };


  constructor(private utils: Utils,
    private store: Store<CoreState>,
    private userActions: UserActions,
    protected cd: ChangeDetectorRef,
    public ngZone: NgZone) {
    this.loggedInUserId = '';
  }

  ngOnInit() {

    this.userDict$ = this.store.select(coreState).pipe(select(s => s.userDict));
    this.subscriptions.push(this.userDict$.subscribe(userDict => {
      this.userDict = userDict;
      if (this.user) {
        if (userDict[this.userId] && this.user) {
          const isMatch = JSON.stringify(this.user).toLowerCase() === JSON.stringify(this.userDict[this.userId]).toLowerCase();
          if (!isMatch) {
            this.user = this.userDict[this.userId];
            this.userChange.emit(this.user);
            this.cd.markForCheck();
          }
        }
      } else {
        this.user = this.userDict[this.userId];
      }
    }));
    this.subscriptions.push(this.store.select(coreState)
      .pipe(select(s => s.user)).subscribe(user => {
        this.loggedInUserId = (user) ? user.userId : '';
        this.loadUserInfo();

        this.cd.markForCheck();
      }));
  }


  getImageUrl(user: User, width, height) {

    const imageUrl = this.utils.getImageUrl(user, width, height, `${width}X${height}`);
    this.cd.markForCheck();
    return imageUrl;
  }

  ngOnDestroy(): void {

  }

  ngOnChanges() {
    this.loadUserInfo();
    this.cd.markForCheck();
  }

  loadUserInfo() {
    if (this.userId) {
        this.store.dispatch(this.userActions.loadOtherUserProfile(this.userId));
        this.cd.markForCheck();
      }
    }
}