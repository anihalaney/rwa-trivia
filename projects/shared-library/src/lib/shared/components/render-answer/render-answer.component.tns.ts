import { Component, Input, OnInit, SimpleChanges, OnChanges } from "@angular/core";
import { Answer} from "shared-library/shared/model";
import { WebView, LoadEventData } from 'tns-core-modules/ui/web-view';
import { isAndroid, isIOS, device, screen } from 'tns-core-modules/platform';

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


    scriptToGetHeight = `<script> var body = document.body, html = document.documentElement;
    var height = Math.max(body.scrollHeight, body.offsetHeight,
    html.clientHeight, html.scrollHeight, html.offsetHeight);
    document.location.href += "#" + height;
    </script>`;
    // tslint:disable-next-line:max-line-length
    htmlStartTag = `<html><head><body style="font-size:18px;font-weight: bold !important;padding-top:10px;vertical-align: middle;text-align:left;"><meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1.0, user-scalable=no"> `;
    // tslint:disable-next-line:max-line-length
    htmlEndTag = `</body><link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.10.1/dist/katex.min.css" integrity="sha384-dbVIfZGuN1Yq7/1Ocstc1lUEm+AT+/rCkibIcC/OmWo5f0EA48Vf8CytHzGrSwbQ" crossorigin="anonymous"></html>`;
    questionHeight = 0;
    isAndroid = isAndroid;
    ngOnInit(): void {
        console.log(this.answer);
        if (this.answer && this.answer.isRichEditor) {
            // tslint:disable-next-line:max-line-length
            this.answer.answerText = this.htmlStartTag + this.answer.answerText + this.scriptToGetHeight + this.htmlEndTag;
        }
    }

    onLoadFinished(event: LoadEventData) {
        if (isIOS && this.answer) {
            const height = event.url.split('#')[1];
            this.questionHeight = Number(height);
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        if (this.renderWebView) {
            // if (changes.answer) {
            //     // tslint:disable-next-line:max-line-length
            //     this.answer.answerText = this.htmlStartTag +  changes.answer.currentValue.answerText + this.scriptToGetHeight + this.htmlEndTag;
            // }
        }
    }


}
