import { Component, Input, OnInit, SimpleChanges, OnChanges } from "@angular/core";
import { Answer, Question } from "shared-library/shared/model";
import { WebView, LoadEventData } from 'tns-core-modules/ui/web-view';


@Component({
    selector: 'render-answer',
    moduleId: module.id,
    templateUrl: 'render-answer.component.html',
    styleUrls: ['render-answer.component.css']
})

export class RenderAnswerComponent implements OnInit, OnChanges {

    @Input() renderWebView: boolean;
    @Input() answer: Answer;
    @Input() questionIndex: number;


    ngOnInit(): void {
        setTimeout(() => {
            // this.answer.isRichEditor = true;
            this.answer = { ...this.answer };
        }, 5000);

    }

    ngOnChanges(changes: SimpleChanges) {

        // if (this.renderWebView) {
        if (changes.renderWebView) {
            this.renderWebView = changes.renderWebView.currentValue;
        }
    }
}
