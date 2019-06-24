import { Component, Input, OnInit, SimpleChanges, OnChanges } from "@angular/core";
import { Answer } from "shared-library/shared/model";
import { LoadEventData } from 'tns-core-modules/ui/web-view';
import { isAndroid, isIOS } from 'tns-core-modules/platform';
import { CONFIG } from './../../../environments/environment';

@Component({
    selector: 'render-answer',
    moduleId: module.id,
    templateUrl: 'render-answer.component.html',
    styleUrls: ['render-answer.component.css']
})

export class RenderAnswerComponent implements OnInit, OnChanges {

    @Input() answer: Answer;
    @Input() questionIndex: number;
    @Input() isGameAnswer: boolean;
    @Input() isRight;
    @Input() isWrong;
    @Input() doPlay;

    scriptToGetHeight = `<script> var body = document.body, html = document.documentElement;
    var height = Math.max(body.scrollHeight, body.offsetHeight,
    html.clientHeight, html.scrollHeight, html.offsetHeight);
    document.location.href += "#" + height;
    </script><style>pre.ql-syntax { background-color: #23241f;overflow: visible;}</style>`;
    // tslint:disable-next-line:max-line-length
    htmlStartTag = `<html><head><body style="font-size:12px; ${this.isGameAnswer ? 'font-weight: bold !important;' : ''} padding-top:10px;vertical-align: middle;text-align:left;"><meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1.0, user-scalable=no">   <script src="${CONFIG.hightlighJsURL}"></script>`;
    // tslint:disable-next-line:max-line-length
    htmlEndTag = `</body><link rel="stylesheet" href="${CONFIG.katexCSSURL}" integrity="sha384-dbVIfZGuN1Yq7/1Ocstc1lUEm+AT+/rCkibIcC/OmWo5f0EA48Vf8CytHzGrSwbQ" crossorigin="anonymous"><link rel="stylesheet" href="${CONFIG.hightlighCSSURL}" crossorigin="anonymous"></html>`;
    answerHeight = 0;
    isAndroid = isAndroid;

    ngOnInit(): void {
        if (this.answer && this.answer.isRichEditor) {
            // tslint:disable-next-line:max-line-length
            this.answer.answerText = this.htmlStartTag + this.answer.answerText + this.scriptToGetHeight + this.htmlEndTag;
        }
        if (!this.doPlay) {
            this.doPlay = false;
        }
    }

    onLoadFinished(event: LoadEventData) {
        if (isIOS && this.answer) {
            const height = event.url.split('#')[1];
            if (height) {
                this.answerHeight = parseInt(height, 10);
            }

        }
    }

    answerButtonClicked(answer: Answer) {
    }

    ngOnChanges(changes: SimpleChanges) {
        if (this.answer.isRichEditor) {
            if (changes.isRight) {
                if (changes.isRight.currentValue) {
                    // tslint:disable-next-line:max-line-length
                    this.answer.answerText = `${this.htmlStartTag} ${this.answer.answerText}   <style> html {background:#71b02f;color:#ffffff;font-size:17;}</style> ${this.scriptToGetHeight}   ${this.htmlEndTag}`;
                }
            }
            if (changes.isWrong) {
                if (changes.isWrong.currentValue) {
                    // tslint:disable-next-line:max-line-length
                    this.answer.answerText = `${this.htmlStartTag}  ${this.answer.answerText}   <style> html {background:#d54937;color:#ffffff;font-size:17;}</style> ${this.scriptToGetHeight}   ${this.htmlEndTag}`;

                }
            }
        }
    }


}
