import { Component, Input, OnChanges, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { User } from '../../model';
import { Utils } from '../../../core/services';
import { Store } from '@ngrx/store';
import { CoreState } from '../../../core/store';
import { UserActions } from '../../../core/store/actions';

@Component({
    selector: 'author',
    templateUrl: './author.component.html',
    styleUrls: ['./author.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class AuthorComponent implements OnChanges {

    @Input() userDict: { [key: string]: User };
    @Input() userId;
    userProfileImageUrl;

    constructor(private store: Store<CoreState>, private userActions: UserActions) {

    }

    ngOnChanges() {
        if (this.userId) {
            if (this.userDict[this.userId] === undefined) {
                this.store.dispatch(this.userActions.loadOtherUserProfile(this.userId));
            } else {
                this.userProfileImageUrl = Utils.getImageUrl(this.userDict[this.userId], 44, 40, '44X40');
            }
        }
    }
}
