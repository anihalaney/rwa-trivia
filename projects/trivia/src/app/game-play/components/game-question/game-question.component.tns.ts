import { Component, Input, OnInit, OnDestroy, SimpleChanges, OnChanges, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { User, Answer } from 'shared-library/shared/model';
import { Utils } from 'shared-library/core/services';
import { GameQuestion } from './game-question';
import { Store, select } from '@ngrx/store';
import { GamePlayState } from '../../store';
import { appState } from '../../../store';
import { Observable, timer, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';

@Component({
  selector: 'game-question',
  templateUrl: './game-question.component.html',
  styleUrls: ['./game-question.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

@AutoUnsubscribe({ 'arrayName': 'subscriptions' })
export class GameQuestionComponent extends GameQuestion implements OnInit, OnDestroy, OnChanges {

  @Input() user: User;
  subscriptions = [];
  answeredIndex: number;
  correctAnswerIndex: number;
  minutes = 0.62;
  public progressValue: number;
  stopProcessBar;
  columns;
  doPlay = true;
  photoUrl: String = '~/assets/icons/icon-192x192.png';
  userDict$: Observable<{ [key: string]: User }>;
  processTimeInterval: number;
  elapsedTime: number;
  timerSub: Subscription;

   // TODO: Remove after complete math editor
  // tslint:disable-next-line: max-line-length
  questionHtml = '<p><br></p><p><span class="ql-formula" data-value="a\ +b\ -c">﻿<span contenteditable="false"><span class="katex"><span class="katex-mathml"><math><semantics><mrow><mi>a</mi><mtext>&nbsp;</mtext><mo>+</mo><mi>b</mi><mtext>&nbsp;</mtext><mo>−</mo><mi>c</mi></mrow><annotation encoding="application/x-tex">a\ +b\ -c</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height: 0.66666em; vertical-align: -0.08333em;"></span><span class="mord mathdefault">a</span><span class="mspace" style="margin-right: 0.222222em;"></span><span class="mspace">&nbsp;</span><span class="mbin">+</span><span class="mspace" style="margin-right: 0.222222em;"></span></span><span class="base"><span class="strut" style="height: 0.77777em; vertical-align: -0.08333em;"></span><span class="mord mathdefault">b</span><span class="mspace" style="margin-right: 0.222222em;"></span><span class="mspace">&nbsp;</span><span class="mbin">−</span><span class="mspace" style="margin-right: 0.222222em;"></span></span><span class="base"><span class="strut" style="height: 0.43056em; vertical-align: 0em;"></span><span class="mord mathdefault">c</span></span></span></span></span>﻿</span></p>';

  // tslint:disable-next-line: max-line-length
  questionHtml2 = '<p>Maths <span class="ql-formula" data-value="\sqrt{a\ +\ b\ -c}">﻿<span contenteditable="false"><span class="katex"><span class="katex-mathml"><math><semantics><mrow><msqrt><mrow><mi>a</mi><mtext>&nbsp;</mtext><mo>+</mo><mtext>&nbsp;</mtext><mi>b</mi><mtext>&nbsp;</mtext><mo>−</mo><mi>c</mi></mrow></msqrt></mrow><annotation encoding="application/x-tex">\sqrt{a\ +\ b\ -c}</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height: 1.04em; vertical-align: -0.149445em;"></span><span class="mord sqrt"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height: 0.890555em;"><span class="svg-align" style="top: -3em;"><span class="pstrut" style="height: 3em;"></span><span class="mord" style="padding-left: 0.833em;"><span class="mord mathdefault">a</span><span class="mspace" style="margin-right: 0.222222em;"></span><span class="mspace">&nbsp;</span><span class="mbin">+</span><span class="mspace" style="margin-right: 0.222222em;"></span><span class="mspace">&nbsp;</span><span class="mord mathdefault">b</span><span class="mspace" style="margin-right: 0.222222em;"></span><span class="mspace">&nbsp;</span><span class="mbin">−</span><span class="mspace" style="margin-right: 0.222222em;"></span><span class="mord mathdefault">c</span></span></span><span class="" style="top: -2.85055em;"><span class="pstrut" style="height: 3em;"></span><span class="hide-tail" style="min-width: 0.853em; height: 1.08em;"><svg width="400em" height="1.08em" viewBox="0 0 400000 1080" preserveAspectRatio="xMinYMin slice"><path d="M95,702c-2.7,0,-7.17,-2.7,-13.5,-8c-5.8,-5.3,-9.5,-10,-9.5,-14c0,-2,0.3,-3.3,1,-4c1.3,-2.7,23.83,-20.7,67.5,-54c44.2,-33.3,65.8,-50.3,66.5,-51c1.3,-1.3,3,-2,5,-2c4.7,0,8.7,3.3,12,10s173,378,173,378c0.7,0,35.3,-71,104,-213c68.7,-142,137.5,-285,206.5,-429c69,-144,104.5,-217.7,106.5,-221c5.3,-9.3,12,-14,20,-14H400000v40H845.2724s-225.272,467,-225.272,467s-235,486,-235,486c-2.7,4.7,-9,7,-19,7c-6,0,-10,-1,-12,-3s-194,-422,-194,-422s-65,47,-65,47z M834 80H400000v40H845z"></path></svg></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height: 0.149445em;"><span class=""></span></span></span></span></span></span></span></span></span>﻿</span></p><p><br></p><p><span class="ql-formula" data-value="\sqrt{a\ +b\ -c\ -ed}">﻿<span contenteditable="false"><span class="katex"><span class="katex-mathml"><math><semantics><mrow><msqrt><mrow><mi>a</mi><mtext>&nbsp;</mtext><mo>+</mo><mi>b</mi><mtext>&nbsp;</mtext><mo>−</mo><mi>c</mi><mtext>&nbsp;</mtext><mo>−</mo><mi>e</mi><mi>d</mi></mrow></msqrt></mrow><annotation encoding="application/x-tex">\sqrt{a\ +b\ -c\ -ed}</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height: 1.04em; vertical-align: -0.149445em;"></span><span class="mord sqrt"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height: 0.890555em;"><span class="svg-align" style="top: -3em;"><span class="pstrut" style="height: 3em;"></span><span class="mord" style="padding-left: 0.833em;"><span class="mord mathdefault">a</span><span class="mspace" style="margin-right: 0.222222em;"></span><span class="mspace">&nbsp;</span><span class="mbin">+</span><span class="mspace" style="margin-right: 0.222222em;"></span><span class="mord mathdefault">b</span><span class="mspace" style="margin-right: 0.222222em;"></span><span class="mspace">&nbsp;</span><span class="mbin">−</span><span class="mspace" style="margin-right: 0.222222em;"></span><span class="mord mathdefault">c</span><span class="mspace" style="margin-right: 0.222222em;"></span><span class="mspace">&nbsp;</span><span class="mbin">−</span><span class="mspace" style="margin-right: 0.222222em;"></span><span class="mord mathdefault">e</span><span class="mord mathdefault">d</span></span></span><span class="" style="top: -2.85055em;"><span class="pstrut" style="height: 3em;"></span><span class="hide-tail" style="min-width: 0.853em; height: 1.08em;"><svg width="400em" height="1.08em" viewBox="0 0 400000 1080" preserveAspectRatio="xMinYMin slice"><path d="M95,702c-2.7,0,-7.17,-2.7,-13.5,-8c-5.8,-5.3,-9.5,-10,-9.5,-14c0,-2,0.3,-3.3,1,-4c1.3,-2.7,23.83,-20.7,67.5,-54c44.2,-33.3,65.8,-50.3,66.5,-51c1.3,-1.3,3,-2,5,-2c4.7,0,8.7,3.3,12,10s173,378,173,378c0.7,0,35.3,-71,104,-213c68.7,-142,137.5,-285,206.5,-429c69,-144,104.5,-217.7,106.5,-221c5.3,-9.3,12,-14,20,-14H400000v40H845.2724s-225.272,467,-225.272,467s-235,486,-235,486c-2.7,4.7,-9,7,-19,7c-6,0,-10,-1,-12,-3s-194,-422,-194,-422s-65,47,-65,47z M834 80H400000v40H845z"></path></svg></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height: 0.149445em;"><span class=""></span></span></span></span></span></span></span></span></span>﻿</span></p><p><br></p><p><img src="https://firebasestorage.googleapis.com/v0/b/rwa-trivia-dev-e57fc.appspot.com/o/questions%2F1559214105804-wycBIFR4.jpg?alt=media&amp;token=7a319420-45a3-4974-b94a-b42f15fc781b" height="157" width="157"></p>';

  // tslint:disable-next-line: max-line-length
  questionHtml3 = '<p><span class="ql-formula" data-value="\left(x^2y\ -\ 3y^2+\ 5xy^2\right)\ \ -\ \left(-x^2y\ +3xy^2\ -3y^2\right)">﻿<span contenteditable="false"><span class="katex"><span class="katex-mathml"><math><semantics><mrow><mrow><mo fence="true">(</mo><msup><mi>x</mi><mn>2</mn></msup><mi>y</mi><mtext>&nbsp;</mtext><mo>−</mo><mtext>&nbsp;</mtext><mn>3</mn><msup><mi>y</mi><mn>2</mn></msup><mo>+</mo><mtext>&nbsp;</mtext><mn>5</mn><mi>x</mi><msup><mi>y</mi><mn>2</mn></msup><mo fence="true">)</mo></mrow><mtext>&nbsp;&nbsp;</mtext><mo>−</mo><mtext>&nbsp;</mtext><mrow><mo fence="true">(</mo><mo>−</mo><msup><mi>x</mi><mn>2</mn></msup><mi>y</mi><mtext>&nbsp;</mtext><mo>+</mo><mn>3</mn><mi>x</mi><msup><mi>y</mi><mn>2</mn></msup><mtext>&nbsp;</mtext><mo>−</mo><mn>3</mn><msup><mi>y</mi><mn>2</mn></msup><mo fence="true">)</mo></mrow></mrow><annotation encoding="application/x-tex">\left(x^2y\ -\ 3y^2+\ 5xy^2\right)\ \ -\ \left(-x^2y\ +3xy^2\ -3y^2\right)</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height: 1.20001em; vertical-align: -0.35001em;"></span><span class="minner"><span class="mopen delimcenter" style="top: 0em;"><span class="delimsizing size1">(</span></span><span class="mord"><span class="mord mathdefault">x</span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height: 0.814108em;"><span class="" style="top: -3.063em; margin-right: 0.05em;"><span class="pstrut" style="height: 2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight">2</span></span></span></span></span></span></span></span><span class="mord mathdefault" style="margin-right: 0.03588em;">y</span><span class="mspace" style="margin-right: 0.222222em;"></span><span class="mspace">&nbsp;</span><span class="mbin">−</span><span class="mspace" style="margin-right: 0.222222em;"></span><span class="mspace">&nbsp;</span><span class="mord">3</span><span class="mord"><span class="mord mathdefault" style="margin-right: 0.03588em;">y</span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height: 0.814108em;"><span class="" style="top: -3.063em; margin-right: 0.05em;"><span class="pstrut" style="height: 2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight">2</span></span></span></span></span></span></span></span><span class="mspace" style="margin-right: 0.222222em;"></span><span class="mbin">+</span><span class="mspace" style="margin-right: 0.222222em;"></span><span class="mspace">&nbsp;</span><span class="mord">5</span><span class="mord mathdefault">x</span><span class="mord"><span class="mord mathdefault" style="margin-right: 0.03588em;">y</span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height: 0.814108em;"><span class="" style="top: -3.063em; margin-right: 0.05em;"><span class="pstrut" style="height: 2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight">2</span></span></span></span></span></span></span></span><span class="mclose delimcenter" style="top: 0em;"><span class="delimsizing size1">)</span></span></span><span class="mspace" style="margin-right: 0.222222em;"></span><span class="mspace">&nbsp;</span><span class="mspace">&nbsp;</span><span class="mbin">−</span><span class="mspace" style="margin-right: 0.222222em;"></span><span class="mspace">&nbsp;</span></span><span class="base"><span class="strut" style="height: 1.20001em; vertical-align: -0.35001em;"></span><span class="minner"><span class="mopen delimcenter" style="top: 0em;"><span class="delimsizing size1">(</span></span><span class="mord">−</span><span class="mord"><span class="mord mathdefault">x</span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height: 0.814108em;"><span class="" style="top: -3.063em; margin-right: 0.05em;"><span class="pstrut" style="height: 2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight">2</span></span></span></span></span></span></span></span><span class="mord mathdefault" style="margin-right: 0.03588em;">y</span><span class="mspace" style="margin-right: 0.222222em;"></span><span class="mspace">&nbsp;</span><span class="mbin">+</span><span class="mspace" style="margin-right: 0.222222em;"></span><span class="mord">3</span><span class="mord mathdefault">x</span><span class="mord"><span class="mord mathdefault" style="margin-right: 0.03588em;">y</span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height: 0.814108em;"><span class="" style="top: -3.063em; margin-right: 0.05em;"><span class="pstrut" style="height: 2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight">2</span></span></span></span></span></span></span></span><span class="mspace" style="margin-right: 0.222222em;"></span><span class="mspace">&nbsp;</span><span class="mbin">−</span><span class="mspace" style="margin-right: 0.222222em;"></span><span class="mord">3</span><span class="mord"><span class="mord mathdefault" style="margin-right: 0.03588em;">y</span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height: 0.814108em;"><span class="" style="top: -3.063em; margin-right: 0.05em;"><span class="pstrut" style="height: 2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight">2</span></span></span></span></span></span></span></span><span class="mclose delimcenter" style="top: 0em;"><span class="delimsizing size1">)</span></span></span></span></span></span></span>﻿</span></p><p><br></p><p>Which of the following is equivalent to the expression above?</p>';

  answer = [{
    // tslint:disable-next-line: max-line-length
    answerText: '<p><span class="ql-formula" data-value="2x^{x2}y\ +\ 8xy^2\ -6y^2">﻿<span contenteditable="false"><span class="katex"><span class="katex-mathml"><math><semantics><mrow><mn>2</mn><msup><mi>x</mi><mrow><mi>x</mi><mn>2</mn></mrow></msup><mi>y</mi><mtext>&nbsp;</mtext><mo>+</mo><mtext>&nbsp;</mtext><mn>8</mn><mi>x</mi><msup><mi>y</mi><mn>2</mn></msup><mtext>&nbsp;</mtext><mo>−</mo><mn>6</mn><msup><mi>y</mi><mn>2</mn></msup></mrow><annotation encoding="application/x-tex">2x^{x2}y\ +\ 8xy^2\ -6y^2</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height: 1.00855em; vertical-align: -0.19444em;"></span><span class="mord">2</span><span class="mord"><span class="mord mathdefault">x</span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height: 0.814108em;"><span class="" style="top: -3.063em; margin-right: 0.05em;"><span class="pstrut" style="height: 2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mathdefault mtight">x</span><span class="mord mtight">2</span></span></span></span></span></span></span></span></span><span class="mord mathdefault" style="margin-right: 0.03588em;">y</span><span class="mspace" style="margin-right: 0.222222em;"></span><span class="mspace">&nbsp;</span><span class="mbin">+</span><span class="mspace" style="margin-right: 0.222222em;"></span><span class="mspace">&nbsp;</span></span><span class="base"><span class="strut" style="height: 1.00855em; vertical-align: -0.19444em;"></span><span class="mord">8</span><span class="mord mathdefault">x</span><span class="mord"><span class="mord mathdefault" style="margin-right: 0.03588em;">y</span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height: 0.814108em;"><span class="" style="top: -3.063em; margin-right: 0.05em;"><span class="pstrut" style="height: 2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight">2</span></span></span></span></span></span></span></span><span class="mspace" style="margin-right: 0.222222em;"></span><span class="mspace">&nbsp;</span><span class="mbin">−</span><span class="mspace" style="margin-right: 0.222222em;"></span></span><span class="base"><span class="strut" style="height: 1.00855em; vertical-align: -0.19444em;"></span><span class="mord">6</span><span class="mord"><span class="mord mathdefault" style="margin-right: 0.03588em;">y</span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height: 0.814108em;"><span class="" style="top: -3.063em; margin-right: 0.05em;"><span class="pstrut" style="height: 2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight">2</span></span></span></span></span></span></span></span></span></span></span></span>﻿</span></p>',
    isRichEditor: true,
  },
  {
    // answerText: 'b',
    // isRichEditor: false,
    // answerText: this.questionHtml2,
    answerText: '<p><span class="ql-formula" data-value="4x^2y^2">﻿<span contenteditable="false"><span class="katex"><span class="katex-mathml"><math><semantics><mrow><mn>4</mn><msup><mi>x</mi><mn>2</mn></msup><msup><mi>y</mi><mn>2</mn></msup></mrow><annotation encoding="application/x-tex">4x^2y^2</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height: 1.00855em; vertical-align: -0.19444em;"></span><span class="mord">4</span><span class="mord"><span class="mord mathdefault">x</span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height: 0.814108em;"><span class="" style="top: -3.063em; margin-right: 0.05em;"><span class="pstrut" style="height: 2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight">2</span></span></span></span></span></span></span></span><span class="mord"><span class="mord mathdefault" style="margin-right: 0.03588em;">y</span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height: 0.814108em;"><span class="" style="top: -3.063em; margin-right: 0.05em;"><span class="pstrut" style="height: 2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight">2</span></span></span></span></span></span></span></span></span></span></span></span>﻿</span></p><p><br></p>',
    isRichEditor: true
  },
  {
    // answerText: 'c',
    answerText: '<p><span class="ql-formula" data-value="8xy^2\ \ -\ 6y^2">﻿<span contenteditable="false"><span class="katex"><span class="katex-mathml"><math><semantics><mrow><mn>8</mn><mi>x</mi><msup><mi>y</mi><mn>2</mn></msup><mtext>&nbsp;&nbsp;</mtext><mo>−</mo><mtext>&nbsp;</mtext><mn>6</mn><msup><mi>y</mi><mn>2</mn></msup></mrow><annotation encoding="application/x-tex">8xy^2\ \ -\ 6y^2</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height: 1.00855em; vertical-align: -0.19444em;"></span><span class="mord">8</span><span class="mord mathdefault">x</span><span class="mord"><span class="mord mathdefault" style="margin-right: 0.03588em;">y</span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height: 0.814108em;"><span class="" style="top: -3.063em; margin-right: 0.05em;"><span class="pstrut" style="height: 2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight">2</span></span></span></span></span></span></span></span><span class="mspace" style="margin-right: 0.222222em;"></span><span class="mspace">&nbsp;</span><span class="mspace">&nbsp;</span><span class="mbin">−</span><span class="mspace" style="margin-right: 0.222222em;"></span><span class="mspace">&nbsp;</span></span><span class="base"><span class="strut" style="height: 1.00855em; vertical-align: -0.19444em;"></span><span class="mord">6</span><span class="mord"><span class="mord mathdefault" style="margin-right: 0.03588em;">y</span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height: 0.814108em;"><span class="" style="top: -3.063em; margin-right: 0.05em;"><span class="pstrut" style="height: 2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight">2</span></span></span></span></span></span></span></span></span></span></span></span>﻿</span></p>',
    isRichEditor: true,
  },
  {
    // answerText: 'd',
    answerText: '<p><span class="ql-formula" data-value="2x^2y\ +\ 2xy^2">﻿<span contenteditable="false"><span class="katex"><span class="katex-mathml"><math><semantics><mrow><mn>2</mn><msup><mi>x</mi><mn>2</mn></msup><mi>y</mi><mtext>&nbsp;</mtext><mo>+</mo><mtext>&nbsp;</mtext><mn>2</mn><mi>x</mi><msup><mi>y</mi><mn>2</mn></msup></mrow><annotation encoding="application/x-tex">2x^2y\ +\ 2xy^2</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height: 1.00855em; vertical-align: -0.19444em;"></span><span class="mord">2</span><span class="mord"><span class="mord mathdefault">x</span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height: 0.814108em;"><span class="" style="top: -3.063em; margin-right: 0.05em;"><span class="pstrut" style="height: 2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight">2</span></span></span></span></span></span></span></span><span class="mord mathdefault" style="margin-right: 0.03588em;">y</span><span class="mspace" style="margin-right: 0.222222em;"></span><span class="mspace">&nbsp;</span><span class="mbin">+</span><span class="mspace" style="margin-right: 0.222222em;"></span><span class="mspace">&nbsp;</span></span><span class="base"><span class="strut" style="height: 1.00855em; vertical-align: -0.19444em;"></span><span class="mord">2</span><span class="mord mathdefault">x</span><span class="mord"><span class="mord mathdefault" style="margin-right: 0.03588em;">y</span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height: 0.814108em;"><span class="" style="top: -3.063em; margin-right: 0.05em;"><span class="pstrut" style="height: 2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight">2</span></span></span></span></span></span></span></span></span></span></span></span>﻿</span></p>',
    isRichEditor: true,
  }
  ];

  constructor(private utils: Utils, public store: Store<GamePlayState>, private cd: ChangeDetectorRef) {
    super();
    this.userDict$ = store.select(appState.coreState).pipe(select(s => s.userDict));
  }

  ngOnInit() {
    this.progressValue = 0;
    this.photoUrl = this.utils.getImageUrl(this.user, 70, 60, '70X60');

   // TODO: Remove after complete math editor
   if (this.question.answers) {
    this.question.questionText = this.questionHtml3;
    this.question.maxTime = 50;
    this.question.isRichEditor = true;
    this.question.answers.forEach((ans, index) => {
      ans.answerText = this.answer[index].answerText;
      ans.isRichEditor = this.answer[index].isRichEditor;
    });
  }
  this.cd.markForCheck();
  }

  ngOnDestroy() {

  }

  fillTimer() {
   if (this.answeredIndex === undefined) {
      this.progressValue = 100;
   }
  }

  getImage(userId) {
    return this.utils.getImageUrl(this.userDict[userId], 44, 40, '44X40');
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.continueNext && this.answeredIndex === undefined) {
      this.progressValue = 100;
    } else if (changes.timer) {
      this.timer = this.MAX_TIME_IN_SECONDS - changes.timer.currentValue;
      if (this.timerSub) {
        this.utils.unsubscribe([this.timerSub]);
      }
      this.progressValue = (this.timer * 100) / this.MAX_TIME_IN_SECONDS;

      this.timerSub =
        timer(0, 10).pipe(take(90)).subscribe(t => {
          this.timer += 0.010;
          this.progressValue = (this.timer / this.MAX_TIME_IN_SECONDS) * 100;
          this.cd.markForCheck();
        },
          null,
          () => {
            this.utils.unsubscribe([this.timerSub]);
          });
      this.subscriptions.push(this.timerSub);
    }
  }
}
