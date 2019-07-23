import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { User, userCardType, Invitation } from 'shared-library/shared/model';
import { Utils } from 'shared-library/core/services';
import { CoreState, coreState } from './../../../core/store';
import { Store, select } from '@ngrx/store';
import { filter } from 'rxjs/operators';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';

@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.scss']
})
@AutoUnsubscribe({ 'arrayName': 'subscriptions' })
export class UserCardComponent implements OnInit, OnDestroy {

  @Input() user: User;
  @Input() type: number;
  @Input() isGamePlay: boolean;
  @Input() invitation: Invitation;
  @Input() gameStatus: string;
  loggedInUserId: string;
  userCardType = userCardType;
  subscriptions = [];

  constructor(private utils: Utils, private store: Store<CoreState>) {
    this.loggedInUserId = '';
  }

  ngOnInit() {
    console.log('type>', this.type);

    this.subscriptions.push(this.store.select(coreState)
      .pipe(select(s => s.user), filter(u => u !== null)).subscribe(user => {
        this.loggedInUserId = user.userId;
      }));
  }


  getImageUrl(user: User, width, height) {
    return this.utils.getImageUrl(user, width, height, `${width}X${height}`);
  }

  ngOnDestroy(): void {

  }
}
