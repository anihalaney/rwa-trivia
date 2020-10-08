import { Component, OnInit, Input, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy, NgZone, Output, EventEmitter, OnChanges } from '@angular/core';
import { User, userCardType, Invitation } from 'shared-library/shared/model';
import { Utils } from 'shared-library/core/services';
import { CoreState, coreState } from './../../../core/store';
import { Store, select } from '@ngrx/store';
import { AutoUnsubscribe } from 'shared-library/shared/decorators';
import { UserActions } from '../../../core/store/actions';
import { Observable } from 'rxjs';
import * as lodash from 'lodash';

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
  @Input() theme: string;
  @Input() height: number;
  @Input() width: number;
  @Input() isGame: boolean;
  loggedInUserId: string;
  userCardType = userCardType;
  subscriptions = [];
  userDict$: Observable<{ [key: string]: User }>;
  userDict: { [key: string]: User };


  constructor(public utils: Utils,
    private store: Store<CoreState>,
    private userActions: UserActions,
    protected cd: ChangeDetectorRef,
    public ngZone: NgZone) {
    this.loggedInUserId = '';
  }

  ngOnInit() {
    this.userDict$ = this.store.select(coreState).pipe(select(s => s.userDict));
    this.subscriptions.push(this.userDict$.subscribe(userDict => {
      // console.log(userDict);
      this.userDict = userDict;
      if (this.user) {
        if (userDict[this.userId] && this.user) {
          const isMatch = lodash.isEqual(this.user, this.userDict[this.userId]);
          if (!isMatch) {
            this.setUser();
            this.cd.markForCheck();
          }
        }
      } else {
        this.setUser();
        this.cd.markForCheck();
      }
    }));
    this.subscriptions.push(this.store.select(coreState)
      .pipe(select(s => s.user)).subscribe(user => {
        this.loggedInUserId = (user) ? user.userId : '';
        this.loadUserInfo();
        this.setUser();
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
    if (this.userDict && this.userDict[this.userId]) {
      this.user = this.userDict[this.userId];
    }
    this.cd.markForCheck();
  }

  loadUserInfo() {
    if (this.userId) {
      this.store.dispatch(this.userActions.loadOtherUserProfile(this.userId));
      this.cd.markForCheck();
    }
  }

  setUser() {
    if (this.userDict && this.userDict[this.userId]) {
      this.user = this.userDict[this.userId];
      this.cd.markForCheck();
    }
  }


  goToDashboard() {
    this.utils.goToDashboard();
  }

}
