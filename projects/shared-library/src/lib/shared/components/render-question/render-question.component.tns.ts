import { Component, Input, OnInit, SimpleChanges, OnChanges, ChangeDetectorRef } from "@angular/core";
import { Question } from "shared-library/shared/model";
import { LoadEventData } from 'tns-core-modules/ui/web-view';
import { isAndroid, isIOS } from 'tns-core-modules/platform';

@Component({
    selector: 'render-question',
    moduleId: module.id,
    templateUrl: 'render-question.component.html',
    styleUrls: ['render-question.component.css']
})

export class RenderQuestionComponent implements OnInit, OnChanges {

    @Input() question: Question;
    @Input() questionIndex: number;


    scriptToGetHeight = `<script> var body = document.body, html = document.documentElement;
    var height = Math.max(body.scrollHeight, body.offsetHeight,
    html.clientHeight, html.scrollHeight, html.offsetHeight);
    document.location.href += "#" + height;
    </script><style>pre.ql-syntax { background-color: #23241f;color: #f8f8f2;overflow: visible;}</style>`;

    // tslint:disable-next-line:max-line-length
    htmlStartTag = `<html><head><body style="font-size:18px;font-weight: bold !important;padding-top:10px;vertical-align: middle;text-align:left;"><meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1.0, user-scalable=no"> `;
    // tslint:disable-next-line:max-line-length
    htmlEndTag = `</body><link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.10.1/dist/katex.min.css" integrity="sha384-dbVIfZGuN1Yq7/1Ocstc1lUEm+AT+/rCkibIcC/OmWo5f0EA48Vf8CytHzGrSwbQ" crossorigin="anonymous"><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.15.6/styles/a11y-light.min.css" crossorigin="anonymous"></html>`;

    questionHeight = 0;
    qIndex = '';
    isAndroid = isAndroid;
    ngOnInit(): void {
        if (this.question) {
            this.qIndex = this.questionIndex ? `${this.questionIndex} . ` : '';
            if (this.question.isRichEditor) {
                // tslint:disable-next-line:max-line-length
                this.question.questionText = this.htmlStartTag + this.question.questionText + this.scriptToGetHeight + this.htmlEndTag;
            }

        }
    }

    constructor(private cd: ChangeDetectorRef) {
        this.cd.markForCheck();
    }

    onLoadFinished(event: LoadEventData) {
        if (isIOS && this.question) {
            const height = event.url.split('#')[1];
            if (height) {
                this.questionHeight = parseInt(height, 10);
            }
        }
        this.cd.markForCheck();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (this.question && this.question.isRichEditor) {
            if (changes.question) {
                // tslint:disable-next-line:max-line-length
                this.question.questionText = this.htmlStartTag + changes.question.currentValue.questionText + this.scriptToGetHeight + this.htmlEndTag;
            }
            this.cd.markForCheck();
        }
    }


}
