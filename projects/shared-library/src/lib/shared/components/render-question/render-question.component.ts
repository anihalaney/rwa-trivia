import { Component, Input, OnInit } from '@angular/core';
import { Question } from 'shared-library/shared/model';

@Component({
    selector: 'render-question',
    templateUrl: 'render-question.component.html',
    styleUrls: ['render-question.component.css']
})

export class RenderQuestionComponent implements OnInit {


    @Input() question: Question;
    @Input() questionIndex: number | string;


    ngOnInit(): void {
        if (this.questionIndex) {
            this.questionIndex = this.questionIndex + '.';
        }
    }
}
