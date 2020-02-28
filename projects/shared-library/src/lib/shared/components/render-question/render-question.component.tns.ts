import { Component, Input, OnInit, SimpleChanges, OnChanges, ChangeDetectorRef, Output, EventEmitter } from "@angular/core";
import { Question } from 'shared-library/shared/model';
import { LoadEventData } from 'tns-core-modules/ui/web-view';
import { isAndroid, isIOS } from 'tns-core-modules/platform';
import { externalUrl } from './../../../environments/external-url';

@Component({
  selector: 'render-question',
  templateUrl: 'render-question.component.html',
  styleUrls: ['render-question.component.css']
})
export class RenderQuestionComponent implements OnInit, OnChanges {
  @Input() question: Question;
  @Input() questionIndex: number;
  @Input() theme: string;
  @Input() textAlign: string;
  @Output() calHeight = new EventEmitter<number>();
  scriptToGetHeight: string;
  htmlStartTag: string;
  htmlEndTag: string;
  questionHeight = 0;
  qIndex = "";
  isAndroid = isAndroid;
  questionText = "";
  backgroundColor = "transparent";
  textColor = "black";

  ngOnInit(): void {
    if (this.question) {
      this.qIndex = this.questionIndex ? `${this.questionIndex} . ` : "";
      if (this.question.isRichEditor) {
        this.setStartTag();
        // tslint:disable-next-line:max-line-length
        this.questionText =
          this.htmlStartTag +
          this.question.questionText +
          this.scriptToGetHeight +
          this.htmlEndTag;
      } else {
        this.questionText = this.question.questionText;
      }
      this.cd.markForCheck();
    }
  }

  constructor(private cd: ChangeDetectorRef) {
    this.scriptToGetHeight = `<script> var body = document.body, html = document.documentElement;
            var height = Math.max(body.scrollHeight, body.offsetHeight,
            html.clientHeight, html.scrollHeight, html.offsetHeight);
            document.location.href += "#" + height;
            </script><style>pre.ql-syntax { background-color: #efecf4;overflow: visible;}</style>`;

    // tslint:disable-next-line:max-line-length
    this.htmlStartTag = `<html><head><body style="padding-top:10px;vertical-align: middle;text-align:left;background-color:${this.backgroundColor};"><meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1.0, user-scalable=no"> `;
    // tslint:disable-next-line:max-line-length
    this.htmlEndTag = `</body><link rel="stylesheet" href="${externalUrl.katexCSS}" crossorigin="anonymous"><link rel="stylesheet" href="${externalUrl.hightlighCSS}" crossorigin="anonymous"></html>`;
    this.cd.markForCheck();
  }

  onLoadFinished(event: LoadEventData) {
    if (isIOS && this.question) {
      const height = event.url
        ? decodeURIComponent(event.url).split("#")[1]
        : undefined;
      if (height) {
        this.questionHeight = parseInt(height, 10);
        this.calHeight.emit(this.questionHeight);
      } else if (this.question.isRichEditor) {
        this.calHeight.emit(150);
      }
    }
    this.cd.markForCheck();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.question && this.question.isRichEditor) {
      if (changes.question) {
        this.setStartTag();
        this.questionText =
          this.htmlStartTag +
          changes.question.currentValue.questionText +
          this.scriptToGetHeight +
          this.htmlEndTag;
      }
    } else if (this.question) {
      this.questionText = this.question.questionText;
    }
    this.cd.markForCheck();
  }

  setStartTag() {
    if (this.theme) {
      this.backgroundColor = this.theme === "dark" ? "#283b66" : "#f7f7f7";
      this.textColor = this.theme === "dark" ? "#ffffff" : "#a5a5a5";
    }
    this.htmlStartTag = `<html><head><body style="padding-top:10px;vertical-align: middle;text-align:left;background-color:${this.backgroundColor};color:${this.textColor};"><meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1.0, user-scalable=no"> `;
  }
}
