import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { userCardType } from './../../model';


@Component({
    selector: 'author',
    templateUrl: './author.component.html',
    styleUrls: ['./author.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class AuthorComponent {
    @Input() userId;
    @Input() isGamePlay;
    @Input() theme: string;
    userCardType = userCardType;
    newUserid = '';
    constructor() {
    }
}
