import 'reflect-metadata';
import { ComponentFixture } from '@angular/core/testing';
import {
    nsTestBedAfterEach,
    nsTestBedBeforeEach,
    nsTestBedRender,
} from 'nativescript-angular/testing';
import { RenderQuestionComponent } from 'shared-library/shared/components/render-question/render-question.component';
import { NativeScriptFormsModule } from 'nativescript-angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { testData } from 'test/data';
import { LoadEventData } from 'tns-core-modules/ui/web-view';
import { isIOS } from 'tns-core-modules/platform';


describe('RenderQuestionComponent', () => {
    let component: RenderQuestionComponent;
    let fixture: ComponentFixture<RenderQuestionComponent>;

    afterEach(nsTestBedAfterEach());
    beforeEach(nsTestBedBeforeEach([RenderQuestionComponent], [], []));




    beforeEach((async () => {
        fixture = await nsTestBedRender(RenderQuestionComponent);
        component = fixture.componentInstance;
        component.question = testData.questions.published[6];
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('On load it should set scriptToGetHeight, htmlStartTag and htmlEndTag', () => {
        // tslint:disable-next-line: max-line-length
        expect(component.scriptToGetHeight).toBe('<script> var body = document.body, html = document.documentElement;var height = Math.max(body.scrollHeight, body.offsetHeight,html.clientHeight, html.scrollHeight, html.offsetHeight);document.location.href += "#" + height;</script><style>pre.ql-syntax { background-color: #efecf4;overflow: visible;}</style>');
        // tslint:disable-next-line: max-line-length
        expect(component.htmlStartTag).toBe('<html><head><body style="padding-top:10px;vertical-align: middle;text-align:left;background-color:transparent;"><meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1.0, user-scalable=no"> ');
        // tslint:disable-next-line: max-line-length
        expect(component.htmlEndTag).toBe(`</body><link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.10.1/dist/katex.min.css" crossorigin="anonymous"><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.18.1/styles/arduino-light.min.css" crossorigin="anonymous"></html>`);
    });

    it('on call ngoninit it should call setStartTag if question is rich editor and set header,body and footer section to question', () => {
        // tslint:disable-next-line: max-line-length
        const questionAfterSet = `<html><head><body style="padding-top:10px;vertical-align: middle;text-align:left;background-color:transparent;"><meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1.0, user-scalable=no"> <p>Which of the following is not a Java features?</p><script> var body = document.body, html = document.documentElement;var height = Math.max(body.scrollHeight, body.offsetHeight,html.clientHeight, html.scrollHeight, html.offsetHeight);document.location.href += "#" + height;</script><style>pre.ql-syntax { background-color: #efecf4;overflow: visible;}</style></body><link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.10.1/dist/katex.min.css" crossorigin="anonymous"><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.18.1/styles/arduino-light.min.css" crossorigin="anonymous"></html>`
        const spySetStartTag = spyOn(component, 'setStartTag');
        component.ngOnInit();
        expect(component.setStartTag).toHaveBeenCalled();
        expect(component.questionText).toBe(questionAfterSet);
    });


    it(`on webview load finish it should calculate webview's height and should emit the height`, () => {
        const webViewObject: any = {
            ios: {
                scrollView: {
                    scrollEnabled: true
                },
                evaluateJavaScriptCompletionHandler: () => {
                }
            }
        };
        const loadevent: LoadEventData = {
            url: 'https://www.nativescript.org/?height#200',
            navigationType: 'linkClicked', error: '', eventName: '', object: webViewObject
        };
        spyOn(component.calHeight, 'emit');

        component.onLoadFinished(loadevent);
        if (isIOS) {
            expect(component.questionHeight).toBe(200);
            expect(component.calHeight.emit).toHaveBeenCalledWith(200);
        }

    });


    // tslint:disable-next-line: max-line-length
    it(`on webview load finish it should calculate webview's height and should emit the height, it should emit 150 default`, () => {
        const webViewObject: any = {
            ios: {
                scrollView: {
                    scrollEnabled: true
                },
                evaluateJavaScriptCompletionHandler: () => {
                }
            }
        };
        const loadevent: LoadEventData = {
            url: 'https://www.nativescript.org/?height200',
            navigationType: 'linkClicked', error: '', eventName: '', object: webViewObject
        };
        spyOn(component.calHeight, 'emit');
        if (isIOS) {
            component.onLoadFinished(loadevent);
            expect(component.calHeight.emit).toHaveBeenCalledWith(150);
        }
    });


    it(`on ngChanges should set question with html's body when question is rich editor`, () => {
        const question = testData.questions.published[6];

        const spySetStartTag = spyOn(component, 'setStartTag');

        component.ngOnChanges({
            question:
            {
                previousValue: undefined,
                currentValue: question,
                firstChange: true,
                isFirstChange: undefined
            }
        });
        expect(component.setStartTag).toHaveBeenCalled();
        // tslint:disable-next-line: max-line-length
        expect(component.questionText).toBe(`<html><head><body style="padding-top:10px;vertical-align: middle;text-align:left;background-color:transparent;"><meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1.0, user-scalable=no"> <p>Which of the following is not a Java features?</p><script> var body = document.body, html = document.documentElement;var height = Math.max(body.scrollHeight, body.offsetHeight,html.clientHeight, html.scrollHeight, html.offsetHeight);document.location.href += "#" + height;</script><style>pre.ql-syntax { background-color: #efecf4;overflow: visible;}</style></body><link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.10.1/dist/katex.min.css" crossorigin="anonymous"><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.18.1/styles/arduino-light.min.css" crossorigin="anonymous"></html>`)
    });


    it(`on ngChanges should set question should set without html's body when question is not rich editor`, () => {
        const question = testData.questions.published[0];
        component.question = question;

        component.ngOnChanges({
            question:
            {
                previousValue: undefined,
                currentValue: question,
                firstChange: true,
                isFirstChange: undefined
            }
        });

        expect(component.questionText).toBe(question.questionText);
    });

    it(`set setStartTag and set background based on when theme is dark`, () => {
        component.theme = 'dark';
        component.setStartTag();
        // tslint:disable-next-line: max-line-length
        expect(component.htmlStartTag).toBe(`<html><head><body style="padding-top:10px;vertical-align: middle;text-align:left;background-color:#283b66;"><meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1.0, user-scalable=no"> `);
    });

    it(`set setStartTag and set background transparent on when theme is not dark`, () => {
        component.theme = 'light';
        component.setStartTag();
        // tslint:disable-next-line: max-line-length
        expect(component.htmlStartTag).toBe(`<html><head><body style="padding-top:10px;vertical-align: middle;text-align:left;background-color:#f7f7f7;"><meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1.0, user-scalable=no"> `);
    });


});
