import { Component, Input, OnInit, SimpleChanges, OnChanges } from "@angular/core";
import { Answer, Question } from "shared-library/shared/model";
import { WebView, LoadEventData } from 'tns-core-modules/ui/web-view';


@Component({
    selector: 'render-question',
    moduleId: module.id,
    templateUrl: 'render-question.component.html',
    styleUrls: ['render-question.component.css']
})

export class RenderQuestionComponent implements OnInit, OnChanges {

    @Input() renderWebView: boolean;
    @Input() question: Question;
    @Input() questionIndex: number | string;


    ngOnInit(): void {
        if (this.questionIndex) {
            this.questionIndex = this.questionIndex + '.';
        } else {
            this.questionIndex = '';
        }
        setTimeout(() => {
            // this.question.isRichEditor = true;
            this.question = { ...this.question };
        }, 5000);

    }

    ngOnChanges(changes: SimpleChanges) {

        // if (this.renderWebView) {
        if (changes.renderWebView) {
            this.renderWebView = changes.renderWebView.currentValue;
        }
    }
}
