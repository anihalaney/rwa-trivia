import { Component, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { User } from '../../../model';

@Component({
    selector: 'author',
    templateUrl: './author.component.html',
    styleUrls: ['./author.component.scss']
})

export class AuthorComponent {

    @Input() userDict: { [key: string]: User };
    @Input() userId;

}