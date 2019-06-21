import { Component, Input, OnInit } from '@angular/core';
import { Question } from 'shared-library/shared/model';


@Component({
    selector: 'render-question',
    moduleId: module.id,
    templateUrl: 'render-question.component.html',
    styleUrls: ['render-question.component.css']
})

export class RenderQuestionComponent implements OnInit {

    @Input() renderWebView: boolean;
    @Input() question: Question;
    @Input() questionIndex: number | string;


    ngOnInit(): void {
        if (this.questionIndex) {
            this.questionIndex = this.questionIndex + '.';
        } else {
            this.questionIndex = '';
        }
        // this.question = { ...this.question };
    }
}
