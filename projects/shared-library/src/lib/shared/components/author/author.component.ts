import { Component, Input, ChangeDetectionStrategy, OnChanges, ChangeDetectorRef } from '@angular/core';
import { User } from '../../model';
import { userCardType } from './../../model';


@Component({
    selector: 'author',
    templateUrl: './author.component.html',
    styleUrls: ['./author.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class AuthorComponent implements OnChanges {

    @Input() userDict: { [key: string]: User };
    @Input() userId;
    @Input() isGamePlay;
    userCardType = userCardType;
    newUserid = '';
    constructor(private cd: ChangeDetectorRef) {
    }

    ngOnChanges() {
        this.cd.markForCheck();
    }
}
