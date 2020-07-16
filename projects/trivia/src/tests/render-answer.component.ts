import 'reflect-metadata';
import { ComponentFixture } from '@angular/core/testing';
import {
    nsTestBedAfterEach,
    nsTestBedBeforeEach,
    nsTestBedRender,
} from 'nativescript-angular/testing';
import { RenderAnswerComponent } from 'shared-library/shared/components/render-answer/render-answer.component';
import { testData } from 'test/data';
import { LoadEventData } from 'tns-core-modules/ui/web-view';
import { isIOS } from 'tns-core-modules/platform';

describe('RenderAnswerComponent', () => {
    let component: RenderAnswerComponent;
    let fixture: ComponentFixture<RenderAnswerComponent>;
    afterEach(nsTestBedAfterEach());
    beforeEach(nsTestBedBeforeEach([RenderAnswerComponent], [], []));
    beforeEach((async () => {
        fixture = await nsTestBedRender(RenderAnswerComponent);
        component = fixture.componentInstance;
        component.answer = testData.questions.published[6].answers[0];
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('On constructor set default value', () => {
        // tslint:disable-next-line: max-line-length
        expect(component.scriptToGetHeight).toBe(`<script> var body = document.body, html = document.documentElement;var height = Math.max(body.scrollHeight, body.offsetHeight,html.clientHeight, html.scrollHeight, html.offsetHeight);document.location.href += "#" + height;</script><style>pre.ql-syntax { background-color: #23241f;overflow: visible;}</style>`);
        // tslint:disable-next-line: max-line-length
        expect(component.htmlStartTag).toBe(`<html><head><body style="font-size:12px; background-color:'#283b66';padding:10px 0;vertical-align: middle;text-align:center;"><meta name="viewport" content="width=device-width,initial-scale=1, maximum-scale=1.0, user-scalable=no"><script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.15.6/highlight.min.js"></script>`);
        // tslint:disable-next-line: max-line-length
        expect(component.htmlEndTag).toBe(`<style> html {background:#f7f7f7;color:red}</style></body><link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.10.1/dist/katex.min.css" crossorigin="anonymous"><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.18.1/styles/arduino-light.min.css" crossorigin="anonymous"></html>`);
    });

    it('On ngOnInit', () => {
        component.ngOnInit();
        // tslint:disable-next-line: max-line-length
        expect(component.currentAnswer.answerText).toBe(`<html><head><body style="font-size:12px; background-color:'#283b66';padding:10px 0;vertical-align: middle;text-align:center;"><meta name="viewport" content="width=device-width,initial-scale=1, maximum-scale=1.0, user-scalable=no"><script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.15.6/highlight.min.js"></script><p>Dynamic</p><style> html {background:transparent !important;color:black !important;font-size:18;}</style> <script> var body = document.body, html = document.documentElement;var height = Math.max(body.scrollHeight, body.offsetHeight,html.clientHeight, html.scrollHeight, html.offsetHeight);document.location.href += "#" + height;</script><style>pre.ql-syntax { background-color: #23241f;overflow: visible;}</style><style> html {background:#f7f7f7;color:red}</style></body><link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.10.1/dist/katex.min.css" crossorigin="anonymous"><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.18.1/styles/arduino-light.min.css" crossorigin="anonymous"></html>`);

    });


    it('On ngOnInit if theme is not set it should default value of backgorundColor and textcolor', () => {
        component.ngOnInit();

        expect(component.backgroundColor).toBe(`transparent`);
        expect(component.textColor).toBe(`black`);
    });

    it('On ngOnInit if theme is not set it should default value of backgorundColor and textcolor', () => {
        component.theme = 'theme';
        component.ngOnInit();
        // tslint:disable-next-line: max-line-length
        expect(component.backgroundColor).toBe('#f7f7f7');
        expect(component.textColor).toBe(`#a5a5a5`);
    });

    it('On ngOnInit if theme is set dark then it should value of background Color and text color', () => {
        component.theme = 'dark';
        component.ngOnInit();
        // tslint:disable-next-line: max-line-length
        expect(component.backgroundColor).toBe('#283b66');
        expect(component.textColor).toBe(`#a5a5a5`);
    });


    it('On ngOnInit if theme is set light then it should value of background Color and text color', () => {
        component.theme = 'light';
        component.ngOnInit();
        // tslint:disable-next-line: max-line-length
        expect(component.backgroundColor).toBe('#f7f7f7');
        expect(component.textColor).toBe(`#a5a5a5`);
    });

    it('On ngOnInit if doPlay is falsy or undefined then set falsy', () => {
        component.doPlay = false;
        component.ngOnInit();
        expect(component.doPlay).toBeFalsy();
    });


    it(`on webview load finish it should calculate webview's height and should emit the height`, () => {
        component.answer = testData.questions.published[6].answers[0];
        component.ngOnInit();
        const webViewObject: any = {
            ios: {
                scrollView: {
                    scrollEnabled: true
                },
            }
        };
        const loadevent: LoadEventData = {
            url: 'https://www.nativescript.org/?height#200',
            navigationType: 'linkClicked', error: '', eventName: '', object: webViewObject
        };
        spyOn(component.calAnsHeight, 'emit');

        component.onLoadFinished(loadevent);
        if (isIOS) {
            expect(component.answerHeight).toBe(200);
            expect(component.calAnsHeight.emit).toHaveBeenCalledWith(200);
        }

    });

    it(`on webview load finish it should calculate webview's height and if it not found then it should emit 150`, () => {
        component.answer = testData.questions.published[6].answers[0];
        component.ngOnInit();
        const webViewObject: any = {
            ios: {
                scrollView: {
                    scrollEnabled: true
                },
            }
        };
        const loadevent: LoadEventData = {
            url: 'https://www.nativescript.org/?height200',
            navigationType: 'linkClicked', error: '', eventName: '', object: webViewObject
        };
        spyOn(component.calAnsHeight, 'emit');

        component.onLoadFinished(loadevent);
        if (isIOS) {
            // expect(component.answerHeight).toBe(150);
            expect(component.calAnsHeight.emit).toHaveBeenCalledWith(150);
        }

    });


    it(`on call ngOnChanges answertext background color should set background color #d54937`, () => {
        component.answer = testData.questions.published[6].answers[0];
        component.ngOnInit();

        component.ngOnChanges({
            isWrong:
            {
                previousValue: undefined,
                currentValue: true,
                firstChange: true,
                isFirstChange: undefined
            }
        });
        // tslint:disable-next-line: max-line-length
        expect(component.currentAnswer.answerText).toContain(`<style> html {background:#d54937 !important;color:#ffffff !important;font-size:17;}</style>`);
    });


    it(`on call ngOnChanges answertext background color should set background color #71b02f`, () => {
        component.answer = testData.questions.published[6].answers[0];
        component.ngOnInit();

        component.ngOnChanges({
            isRight:
            {
                previousValue: undefined,
                currentValue: true,
                firstChange: true,
                isFirstChange: undefined
            }
        });
        // tslint:disable-next-line: max-line-length
        expect(component.currentAnswer.answerText).toContain(`<style> html {background:#71b02f!important;color:#ffffff !important;font-size:17;}</style>`);
    });

});
