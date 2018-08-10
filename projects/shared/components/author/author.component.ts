import { Component, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { User } from '../../../model';
import { Utils } from '../../services';

@Component({
    selector: 'author',
    templateUrl: './author.component.html',
    styleUrls: ['./author.component.scss']
})

export class AuthorComponent implements OnChanges {

    @Input() userDict: { [key: string]: User };
    @Input() userId;
    userProfileImageUrl;

    ngOnChanges() {
        if (this.userId) {
            this.userProfileImageUrl = Utils.getImageUrl(this.userDict[this.userId], 44, 40, '44X40');
        }
    }
}
