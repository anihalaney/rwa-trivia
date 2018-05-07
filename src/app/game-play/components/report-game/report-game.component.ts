import { Component, Input, Inject } from '@angular/core';
import { Question } from 'app/model';
import { MAT_DIALOG_DATA } from '@angular/material';
@Component({
    selector: 'report-game',
    templateUrl: './report-game.component.html',
    styleUrls: ['./report-game.component.scss']
})
export class ReportGameComponent {

    question: Question;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any) {
        this.question = data.question;
    }

}

