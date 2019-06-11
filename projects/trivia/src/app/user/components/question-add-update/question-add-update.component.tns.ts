import {
  Component, OnDestroy, ViewChild, Input, Output, EventEmitter, OnChanges,
  ViewChildren, QueryList, ElementRef, ChangeDetectionStrategy, ChangeDetectorRef, ViewContainerRef
} from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl, Validators } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { RouterExtensions } from 'nativescript-angular/router';
import { MobUtils } from 'shared-library/core/services/mobile';
import { AppState, appState } from '../../../store';
import { QuestionActions } from 'shared-library/core/store/actions/question.actions';
import { Question, Answer } from 'shared-library/shared/model';
import { QuestionAddUpdate } from './question-add-update';
import { debounceTime, map } from 'rxjs/operators';
import { ObservableArray } from 'tns-core-modules/data/observable-array';
import { TokenModel } from 'nativescript-ui-autocomplete';
import { RadAutoCompleteTextViewComponent } from 'nativescript-ui-autocomplete/angular';
import { Page, isAndroid } from 'tns-core-modules/ui/page';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { WebView, LoadEventData } from 'tns-core-modules/ui/web-view';
import * as webViewInterfaceModule from 'nativescript-webview-interface';
import * as imagepicker from 'nativescript-imagepicker';
import * as dialogs from 'tns-core-modules/ui/dialogs';
import { fromAsset } from 'tns-core-modules/image-source';
import { ImageCropper } from 'nativescript-imagecropper';
import { SegmentedBarItem } from 'tns-core-modules/ui/segmented-bar';
import { isAvailable, requestPermissions, takePicture } from 'nativescript-camera';
import { ImageAsset } from 'tns-core-modules/image-asset';
import { ImageSource } from 'tns-core-modules/image-source';
import { QuestionService } from 'shared-library/core/services';
import { SelectedIndexChangedEventData } from 'nativescript-drop-down';
import { ModalDialogService } from 'nativescript-angular/directives/dialogs';
import { PreviewQuestionDialogComponent } from './preview-question-dialog/preview-question-dialog.component';

@Component({
  selector: 'app-question-add-update',
  templateUrl: './question-add-update.component.html',
  styleUrls: ['./question-add-update.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

@AutoUnsubscribe({ 'arrayName': 'subscriptions' })
export class QuestionAddUpdateComponent extends QuestionAddUpdate implements OnDestroy, OnChanges {

  showSelectCategory = false;
  showSelectTag = false;
  dataItem;
  customTag: string;
  private tagItems: ObservableArray<TokenModel>;
  categoryIds: any[];
  submitBtnTxt: string;
  actionBarTxt: string;
  subscriptions = [];
  oWebViewInterface;

  imagePath: string;

  demoQ: Question = new Question;


  public imageTaken: ImageAsset;
  public saveToGallery = true;
  public keepAspectRatio = true;
  public width = 200;
  public height = 200;
  public answers: any;

  public items: Array<SegmentedBarItem>;
  public selectedIndex = 0;
  tabsTitles: Array<string>;

  public selectedMaxTimeIndex = 0;



  @Input() editQuestion: Question;
  @Output() hideQuestion = new EventEmitter<boolean>();
  @ViewChild('autocomplete') autocomplete: RadAutoCompleteTextViewComponent;
  @ViewChildren('textField') textField: QueryList<ElementRef>;

  questionWebView: ElementRef;
  @ViewChild('questionWebView') set contents(content: ElementRef) {
    this.questionWebView = content;
  }

  @ViewChildren('webView') webView: QueryList<ElementRef>;

  get dataItems(): ObservableArray<TokenModel> {
    return this.tagItems;
  }


  // Constructor
  constructor(public fb: FormBuilder,
    public store: Store<AppState>,
    public utils: MobUtils,
    public questionAction: QuestionActions,
    private routerExtension: RouterExtensions,
    private page: Page, private cd: ChangeDetectorRef,
    public questionService: QuestionService,
    private modal: ModalDialogService,
    private vcRef: ViewContainerRef) {

    super(fb, store, utils, questionAction);
    requestPermissions();
    // tslint:disable-next-line: max-line-length
    // this.demoQ.questionText = '<p><span class="ql-formula" data-value="\left(x^2y\ -\ 3y^2+\ 5xy^2\right)\ \ -\ \left(-x^2y\ +3xy^2\ -3y^2\right)">﻿<span contenteditable="false"><span class="katex"><span class="katex-mathml"><math><semantics><mrow><mrow><mo fence="true">(</mo><msup><mi>x</mi><mn>2</mn></msup><mi>y</mi><mtext>&nbsp;</mtext><mo>−</mo><mtext>&nbsp;</mtext><mn>3</mn><msup><mi>y</mi><mn>2</mn></msup><mo>+</mo><mtext>&nbsp;</mtext><mn>5</mn><mi>x</mi><msup><mi>y</mi><mn>2</mn></msup><mo fence="true">)</mo></mrow><mtext>&nbsp;&nbsp;</mtext><mo>−</mo><mtext>&nbsp;</mtext><mrow><mo fence="true">(</mo><mo>−</mo><msup><mi>x</mi><mn>2</mn></msup><mi>y</mi><mtext>&nbsp;</mtext><mo>+</mo><mn>3</mn><mi>x</mi><msup><mi>y</mi><mn>2</mn></msup><mtext>&nbsp;</mtext><mo>−</mo><mn>3</mn><msup><mi>y</mi><mn>2</mn></msup><mo fence="true">)</mo></mrow></mrow><annotation encoding="application/x-tex">\left(x^2y\ -\ 3y^2+\ 5xy^2\right)\ \ -\ \left(-x^2y\ +3xy^2\ -3y^2\right)</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height: 1.20001em; vertical-align: -0.35001em;"></span><span class="minner"><span class="mopen delimcenter" style="top: 0em;"><span class="delimsizing size1">(</span></span><span class="mord"><span class="mord mathdefault">x</span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height: 0.814108em;"><span class="" style="top: -3.063em; margin-right: 0.05em;"><span class="pstrut" style="height: 2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight">2</span></span></span></span></span></span></span></span><span class="mord mathdefault" style="margin-right: 0.03588em;">y</span><span class="mspace" style="margin-right: 0.222222em;"></span><span class="mspace">&nbsp;</span><span class="mbin">−</span><span class="mspace" style="margin-right: 0.222222em;"></span><span class="mspace">&nbsp;</span><span class="mord">3</span><span class="mord"><span class="mord mathdefault" style="margin-right: 0.03588em;">y</span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height: 0.814108em;"><span class="" style="top: -3.063em; margin-right: 0.05em;"><span class="pstrut" style="height: 2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight">2</span></span></span></span></span></span></span></span><span class="mspace" style="margin-right: 0.222222em;"></span><span class="mbin">+</span><span class="mspace" style="margin-right: 0.222222em;"></span><span class="mspace">&nbsp;</span><span class="mord">5</span><span class="mord mathdefault">x</span><span class="mord"><span class="mord mathdefault" style="margin-right: 0.03588em;">y</span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height: 0.814108em;"><span class="" style="top: -3.063em; margin-right: 0.05em;"><span class="pstrut" style="height: 2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight">2</span></span></span></span></span></span></span></span><span class="mclose delimcenter" style="top: 0em;"><span class="delimsizing size1">)</span></span></span><span class="mspace" style="margin-right: 0.222222em;"></span><span class="mspace">&nbsp;</span><span class="mspace">&nbsp;</span><span class="mbin">−</span><span class="mspace" style="margin-right: 0.222222em;"></span><span class="mspace">&nbsp;</span></span><span class="base"><span class="strut" style="height: 1.20001em; vertical-align: -0.35001em;"></span><span class="minner"><span class="mopen delimcenter" style="top: 0em;"><span class="delimsizing size1">(</span></span><span class="mord">−</span><span class="mord"><span class="mord mathdefault">x</span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height: 0.814108em;"><span class="" style="top: -3.063em; margin-right: 0.05em;"><span class="pstrut" style="height: 2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight">2</span></span></span></span></span></span></span></span><span class="mord mathdefault" style="margin-right: 0.03588em;">y</span><span class="mspace" style="margin-right: 0.222222em;"></span><span class="mspace">&nbsp;</span><span class="mbin">+</span><span class="mspace" style="margin-right: 0.222222em;"></span><span class="mord">3</span><span class="mord mathdefault">x</span><span class="mord"><span class="mord mathdefault" style="margin-right: 0.03588em;">y</span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height: 0.814108em;"><span class="" style="top: -3.063em; margin-right: 0.05em;"><span class="pstrut" style="height: 2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight">2</span></span></span></span></span></span></span></span><span class="mspace" style="margin-right: 0.222222em;"></span><span class="mspace">&nbsp;</span><span class="mbin">−</span><span class="mspace" style="margin-right: 0.222222em;"></span><span class="mord">3</span><span class="mord"><span class="mord mathdefault" style="margin-right: 0.03588em;">y</span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height: 0.814108em;"><span class="" style="top: -3.063em; margin-right: 0.05em;"><span class="pstrut" style="height: 2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight">2</span></span></span></span></span></span></span></span><span class="mclose delimcenter" style="top: 0em;"><span class="delimsizing size1">)</span></span></span></span></span></span></span>﻿</span></p><p><br></p><p>Which of the following is equivalent to the expression above?</p>';
    // this.demoQ.questionText = '<p><span class="ql-formula" data-value="\left(x^2y\ -\ 3y^2+\ 5xy^2\right)\ \ -\ \left(-x^2y\ +3xy^2\ -3y^2\right)">﻿<span contenteditable="false"><span class="katex"><span class="katex-mathml"><math><semantics><mrow><mrow><mo fence="true">(</mo><msup><mi>x</mi><mn>2</mn></msup><mi>y</mi><mtext>&nbsp;</mtext><mo>−</mo><mtext>&nbsp;</mtext><mn>3</mn><msup><mi>y</mi><mn>2</mn></msup><mo>+</mo><mtext>&nbsp;</mtext><mn>5</mn><mi>x</mi><msup><mi>y</mi><mn>2</mn></msup><mo fence="true">)</mo></mrow><mtext>&nbsp;&nbsp;</mtext><mo>−</mo><mtext>&nbsp;</mtext><mrow><mo fence="true">(</mo><mo>−</mo><msup><mi>x</mi><mn>2</mn></msup><mi>y</mi><mtext>&nbsp;</mtext><mo>+</mo><mn>3</mn><mi>x</mi><msup><mi>y</mi><mn>2</mn></msup><mtext>&nbsp;</mtext><mo>−</mo><mn>3</mn><msup><mi>y</mi><mn>2</mn></msup><mo fence="true">)</mo></mrow></mrow><annotation encoding="application/x-tex">\left(x^2y\ -\ 3y^2+\ 5xy^2\right)\ \ -\ \left(-x^2y\ +3xy^2\ -3y^2\right)</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height: 1.20001em; vertical-align: -0.35001em;"></span><span class="minner"><span class="mopen delimcenter" style="top: 0em;"><span class="delimsizing size1">(</span></span><span class="mord"><span class="mord mathdefault">x</span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height: 0.814108em;"><span class="" style="top: -3.063em; margin-right: 0.05em;"><span class="pstrut" style="height: 2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight">2</span></span></span></span></span></span></span></span><span class="mord mathdefault" style="margin-right: 0.03588em;">y</span><span class="mspace" style="margin-right: 0.222222em;"></span><span class="mspace">&nbsp;</span><span class="mbin">−</span><span class="mspace" style="margin-right: 0.222222em;"></span><span class="mspace">&nbsp;</span><span class="mord">3</span><span class="mord"><span class="mord mathdefault" style="margin-right: 0.03588em;">y</span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height: 0.814108em;"><span class="" style="top: -3.063em; margin-right: 0.05em;"><span class="pstrut" style="height: 2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight">2</span></span></span></span></span></span></span></span><span class="mspace" style="margin-right: 0.222222em;"></span><span class="mbin">+</span><span class="mspace" style="margin-right: 0.222222em;"></span><span class="mspace">&nbsp;</span><span class="mord">5</span><span class="mord mathdefault">x</span><span class="mord"><span class="mord mathdefault" style="margin-right: 0.03588em;">y</span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height: 0.814108em;"><span class="" style="top: -3.063em; margin-right: 0.05em;"><span class="pstrut" style="height: 2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight">2</span></span></span></span></span></span></span></span><span class="mclose delimcenter" style="top: 0em;"><span class="delimsizing size1">)</span></span></span><span class="mspace" style="margin-right: 0.222222em;"></span><span class="mspace">&nbsp;</span><span class="mspace">&nbsp;</span><span class="mbin">−</span><span class="mspace" style="margin-right: 0.222222em;"></span><span class="mspace">&nbsp;</span></span><span class="base"><span class="strut" style="height: 1.20001em; vertical-align: -0.35001em;"></span><span class="minner"><span class="mopen delimcenter" style="top: 0em;"><span class="delimsizing size1">(</span></span><span class="mord">−</span><span class="mord"><span class="mord mathdefault">x</span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height: 0.814108em;"><span class="" style="top: -3.063em; margin-right: 0.05em;"><span class="pstrut" style="height: 2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight">2</span></span></span></span></span></span></span></span><span class="mord mathdefault" style="margin-right: 0.03588em;">y</span><span class="mspace" style="margin-right: 0.222222em;"></span><span class="mspace">&nbsp;</span><span class="mbin">+</span><span class="mspace" style="margin-right: 0.222222em;"></span><span class="mord">3</span><span class="mord mathdefault">x</span><span class="mord"><span class="mord mathdefault" style="margin-right: 0.03588em;">y</span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height: 0.814108em;"><span class="" style="top: -3.063em; margin-right: 0.05em;"><span class="pstrut" style="height: 2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight">2</span></span></span></span></span></span></span></span><span class="mspace" style="margin-right: 0.222222em;"></span><span class="mspace">&nbsp;</span><span class="mbin">−</span><span class="mspace" style="margin-right: 0.222222em;"></span><span class="mord">3</span><span class="mord"><span class="mord mathdefault" style="margin-right: 0.03588em;">y</span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height: 0.814108em;"><span class="" style="top: -3.063em; margin-right: 0.05em;"><span class="pstrut" style="height: 2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight">2</span></span></span></span></span></span></span></span><span class="mclose delimcenter" style="top: 0em;"><span class="delimsizing size1">)</span></span></span></span></span></span></span>﻿</span></p><p><br></p><p>Which of the following is equivalent to the expression above?</p>';
    // this.demoQ.questionText = '<p><span class="ql-formula" data-value="2x^{x2}y\ +\ 8xy^2\ -6y^2">﻿<span contenteditable="false"><span class="katex"><span class="katex-mathml"><math><semantics><mrow><mn>2</mn><msup><mi>x</mi><mrow><mi>x</mi><mn>2</mn></mrow></msup><mi>y</mi><mtext>&nbsp;</mtext><mo>+</mo><mtext>&nbsp;</mtext><mn>8</mn><mi>x</mi><msup><mi>y</mi><mn>2</mn></msup><mtext>&nbsp;</mtext><mo>−</mo><mn>6</mn><msup><mi>y</mi><mn>2</mn></msup></mrow><annotation encoding="application/x-tex">2x^{x2}y\ +\ 8xy^2\ -6y^2</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height: 1.00855em; vertical-align: -0.19444em;"></span><span class="mord">2</span><span class="mord"><span class="mord mathdefault">x</span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height: 0.814108em;"><span class="" style="top: -3.063em; margin-right: 0.05em;"><span class="pstrut" style="height: 2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mathdefault mtight">x</span><span class="mord mtight">2</span></span></span></span></span></span></span></span></span><span class="mord mathdefault" style="margin-right: 0.03588em;">y</span><span class="mspace" style="margin-right: 0.222222em;"></span><span class="mspace">&nbsp;</span><span class="mbin">+</span><span class="mspace" style="margin-right: 0.222222em;"></span><span class="mspace">&nbsp;</span></span><span class="base"><span class="strut" style="height: 1.00855em; vertical-align: -0.19444em;"></span><span class="mord">8</span><span class="mord mathdefault">x</span><span class="mord"><span class="mord mathdefault" style="margin-right: 0.03588em;">y</span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height: 0.814108em;"><span class="" style="top: -3.063em; margin-right: 0.05em;"><span class="pstrut" style="height: 2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight">2</span></span></span></span></span></span></span></span><span class="mspace" style="margin-right: 0.222222em;"></span><span class="mspace">&nbsp;</span><span class="mbin">−</span><span class="mspace" style="margin-right: 0.222222em;"></span></span><span class="base"><span class="strut" style="height: 1.00855em; vertical-align: -0.19444em;"></span><span class="mord">6</span><span class="mord"><span class="mord mathdefault" style="margin-right: 0.03588em;">y</span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height: 0.814108em;"><span class="" style="top: -3.063em; margin-right: 0.05em;"><span class="pstrut" style="height: 2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight">2</span></span></span></span></span></span></span></span></span></span></span></span>﻿</span></p>';
    this.demoQ.questionText = '<p>Maths <span class="ql-formula" data-value="\sqrt{a\ +\ b\ -c}">﻿<span contenteditable="false"><span class="katex"><span class="katex-mathml"><math><semantics><mrow><msqrt><mrow><mi>a</mi><mtext>&nbsp;</mtext><mo>+</mo><mtext>&nbsp;</mtext><mi>b</mi><mtext>&nbsp;</mtext><mo>−</mo><mi>c</mi></mrow></msqrt></mrow><annotation encoding="application/x-tex">\sqrt{a\ +\ b\ -c}</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height: 1.04em; vertical-align: -0.149445em;"></span><span class="mord sqrt"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height: 0.890555em;"><span class="svg-align" style="top: -3em;"><span class="pstrut" style="height: 3em;"></span><span class="mord" style="padding-left: 0.833em;"><span class="mord mathdefault">a</span><span class="mspace" style="margin-right: 0.222222em;"></span><span class="mspace">&nbsp;</span><span class="mbin">+</span><span class="mspace" style="margin-right: 0.222222em;"></span><span class="mspace">&nbsp;</span><span class="mord mathdefault">b</span><span class="mspace" style="margin-right: 0.222222em;"></span><span class="mspace">&nbsp;</span><span class="mbin">−</span><span class="mspace" style="margin-right: 0.222222em;"></span><span class="mord mathdefault">c</span></span></span><span class="" style="top: -2.85055em;"><span class="pstrut" style="height: 3em;"></span><span class="hide-tail" style="min-width: 0.853em; height: 1.08em;"><svg width="400em" height="1.08em" viewBox="0 0 400000 1080" preserveAspectRatio="xMinYMin slice"><path d="M95,702c-2.7,0,-7.17,-2.7,-13.5,-8c-5.8,-5.3,-9.5,-10,-9.5,-14c0,-2,0.3,-3.3,1,-4c1.3,-2.7,23.83,-20.7,67.5,-54c44.2,-33.3,65.8,-50.3,66.5,-51c1.3,-1.3,3,-2,5,-2c4.7,0,8.7,3.3,12,10s173,378,173,378c0.7,0,35.3,-71,104,-213c68.7,-142,137.5,-285,206.5,-429c69,-144,104.5,-217.7,106.5,-221c5.3,-9.3,12,-14,20,-14H400000v40H845.2724s-225.272,467,-225.272,467s-235,486,-235,486c-2.7,4.7,-9,7,-19,7c-6,0,-10,-1,-12,-3s-194,-422,-194,-422s-65,47,-65,47z M834 80H400000v40H845z"></path></svg></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height: 0.149445em;"><span class=""></span></span></span></span></span></span></span></span></span>﻿</span></p><p><br></p><p><span class="ql-formula" data-value="\sqrt{a\ +b\ -c\ -ed}">﻿<span contenteditable="false"><span class="katex"><span class="katex-mathml"><math><semantics><mrow><msqrt><mrow><mi>a</mi><mtext>&nbsp;</mtext><mo>+</mo><mi>b</mi><mtext>&nbsp;</mtext><mo>−</mo><mi>c</mi><mtext>&nbsp;</mtext><mo>−</mo><mi>e</mi><mi>d</mi></mrow></msqrt></mrow><annotation encoding="application/x-tex">\sqrt{a\ +b\ -c\ -ed}</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height: 1.04em; vertical-align: -0.149445em;"></span><span class="mord sqrt"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height: 0.890555em;"><span class="svg-align" style="top: -3em;"><span class="pstrut" style="height: 3em;"></span><span class="mord" style="padding-left: 0.833em;"><span class="mord mathdefault">a</span><span class="mspace" style="margin-right: 0.222222em;"></span><span class="mspace">&nbsp;</span><span class="mbin">+</span><span class="mspace" style="margin-right: 0.222222em;"></span><span class="mord mathdefault">b</span><span class="mspace" style="margin-right: 0.222222em;"></span><span class="mspace">&nbsp;</span><span class="mbin">−</span><span class="mspace" style="margin-right: 0.222222em;"></span><span class="mord mathdefault">c</span><span class="mspace" style="margin-right: 0.222222em;"></span><span class="mspace">&nbsp;</span><span class="mbin">−</span><span class="mspace" style="margin-right: 0.222222em;"></span><span class="mord mathdefault">e</span><span class="mord mathdefault">d</span></span></span><span class="" style="top: -2.85055em;"><span class="pstrut" style="height: 3em;"></span><span class="hide-tail" style="min-width: 0.853em; height: 1.08em;"><svg width="400em" height="1.08em" viewBox="0 0 400000 1080" preserveAspectRatio="xMinYMin slice"><path d="M95,702c-2.7,0,-7.17,-2.7,-13.5,-8c-5.8,-5.3,-9.5,-10,-9.5,-14c0,-2,0.3,-3.3,1,-4c1.3,-2.7,23.83,-20.7,67.5,-54c44.2,-33.3,65.8,-50.3,66.5,-51c1.3,-1.3,3,-2,5,-2c4.7,0,8.7,3.3,12,10s173,378,173,378c0.7,0,35.3,-71,104,-213c68.7,-142,137.5,-285,206.5,-429c69,-144,104.5,-217.7,106.5,-221c5.3,-9.3,12,-14,20,-14H400000v40H845.2724s-225.272,467,-225.272,467s-235,486,-235,486c-2.7,4.7,-9,7,-19,7c-6,0,-10,-1,-12,-3s-194,-422,-194,-422s-65,47,-65,47z M834 80H400000v40H845z"></path></svg></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height: 0.149445em;"><span class=""></span></span></span></span></span></span></span></span></span>﻿</span></p><p><br></p><p><img src="https://firebasestorage.googleapis.com/v0/b/rwa-trivia-dev-e57fc.appspot.com/o/questions%2F1559214105804-wycBIFR4.jpg?alt=media&amp;token=7a319420-45a3-4974-b94a-b42f15fc781b" height="157" width="157"></p>';
    // this.demoQ.questionText = 'HEllow this is maths';
    this.demoQ.isRichEditor = true;

    this.demoQ.answers = [{
      id: 1,
      // tslint:disable-next-line: max-line-length
      answerText: '<p><span class="ql-formula" data-value="2x^{x2}y\ +\ 8xy^2\ -6y^2">﻿<span contenteditable="false"><span class="katex"><span class="katex-mathml"><math><semantics><mrow><mn>2</mn><msup><mi>x</mi><mrow><mi>x</mi><mn>2</mn></mrow></msup><mi>y</mi><mtext>&nbsp;</mtext><mo>+</mo><mtext>&nbsp;</mtext><mn>8</mn><mi>x</mi><msup><mi>y</mi><mn>2</mn></msup><mtext>&nbsp;</mtext><mo>−</mo><mn>6</mn><msup><mi>y</mi><mn>2</mn></msup></mrow><annotation encoding="application/x-tex">2x^{x2}y\ +\ 8xy^2\ -6y^2</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height: 1.00855em; vertical-align: -0.19444em;"></span><span class="mord">2</span><span class="mord"><span class="mord mathdefault">x</span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height: 0.814108em;"><span class="" style="top: -3.063em; margin-right: 0.05em;"><span class="pstrut" style="height: 2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mathdefault mtight">x</span><span class="mord mtight">2</span></span></span></span></span></span></span></span></span><span class="mord mathdefault" style="margin-right: 0.03588em;">y</span><span class="mspace" style="margin-right: 0.222222em;"></span><span class="mspace">&nbsp;</span><span class="mbin">+</span><span class="mspace" style="margin-right: 0.222222em;"></span><span class="mspace">&nbsp;</span></span><span class="base"><span class="strut" style="height: 1.00855em; vertical-align: -0.19444em;"></span><span class="mord">8</span><span class="mord mathdefault">x</span><span class="mord"><span class="mord mathdefault" style="margin-right: 0.03588em;">y</span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height: 0.814108em;"><span class="" style="top: -3.063em; margin-right: 0.05em;"><span class="pstrut" style="height: 2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight">2</span></span></span></span></span></span></span></span><span class="mspace" style="margin-right: 0.222222em;"></span><span class="mspace">&nbsp;</span><span class="mbin">−</span><span class="mspace" style="margin-right: 0.222222em;"></span></span><span class="base"><span class="strut" style="height: 1.00855em; vertical-align: -0.19444em;"></span><span class="mord">6</span><span class="mord"><span class="mord mathdefault" style="margin-right: 0.03588em;">y</span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height: 0.814108em;"><span class="" style="top: -3.063em; margin-right: 0.05em;"><span class="pstrut" style="height: 2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight">2</span></span></span></span></span></span></span></span></span></span></span></span>﻿</span></p>',
      isRichEditor: true,
      correct: false
    },
    {
      // answerText: 'b',
      // isRichEditor: false,
      // answerText: this.questionHtml2,
      answerText: '<p><span class="ql-formula" data-value="4x^2y^2">﻿<span contenteditable="false"><span class="katex"><span class="katex-mathml"><math><semantics><mrow><mn>4</mn><msup><mi>x</mi><mn>2</mn></msup><msup><mi>y</mi><mn>2</mn></msup></mrow><annotation encoding="application/x-tex">4x^2y^2</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height: 1.00855em; vertical-align: -0.19444em;"></span><span class="mord">4</span><span class="mord"><span class="mord mathdefault">x</span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height: 0.814108em;"><span class="" style="top: -3.063em; margin-right: 0.05em;"><span class="pstrut" style="height: 2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight">2</span></span></span></span></span></span></span></span><span class="mord"><span class="mord mathdefault" style="margin-right: 0.03588em;">y</span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height: 0.814108em;"><span class="" style="top: -3.063em; margin-right: 0.05em;"><span class="pstrut" style="height: 2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight">2</span></span></span></span></span></span></span></span></span></span></span></span>﻿</span></p><p><br></p>',
      isRichEditor: true,
      id: 2,
      correct: false
    },
    {
      // answerText: 'c',
      answerText: '<p><span class="ql-formula" data-value="8xy^2\ \ -\ 6y^2">﻿<span contenteditable="false"><span class="katex"><span class="katex-mathml"><math><semantics><mrow><mn>8</mn><mi>x</mi><msup><mi>y</mi><mn>2</mn></msup><mtext>&nbsp;&nbsp;</mtext><mo>−</mo><mtext>&nbsp;</mtext><mn>6</mn><msup><mi>y</mi><mn>2</mn></msup></mrow><annotation encoding="application/x-tex">8xy^2\ \ -\ 6y^2</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height: 1.00855em; vertical-align: -0.19444em;"></span><span class="mord">8</span><span class="mord mathdefault">x</span><span class="mord"><span class="mord mathdefault" style="margin-right: 0.03588em;">y</span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height: 0.814108em;"><span class="" style="top: -3.063em; margin-right: 0.05em;"><span class="pstrut" style="height: 2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight">2</span></span></span></span></span></span></span></span><span class="mspace" style="margin-right: 0.222222em;"></span><span class="mspace">&nbsp;</span><span class="mspace">&nbsp;</span><span class="mbin">−</span><span class="mspace" style="margin-right: 0.222222em;"></span><span class="mspace">&nbsp;</span></span><span class="base"><span class="strut" style="height: 1.00855em; vertical-align: -0.19444em;"></span><span class="mord">6</span><span class="mord"><span class="mord mathdefault" style="margin-right: 0.03588em;">y</span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height: 0.814108em;"><span class="" style="top: -3.063em; margin-right: 0.05em;"><span class="pstrut" style="height: 2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight">2</span></span></span></span></span></span></span></span></span></span></span></span>﻿</span></p>',
      isRichEditor: true,
      id: 3,
      correct: false
    },
    {
      answerText: 'd',
      // answerText: '<p><span class="ql-formula" data-value="2x^2y\ +\ 2xy^2">﻿<span contenteditable="false"><span class="katex"><span class="katex-mathml"><math><semantics><mrow><mn>2</mn><msup><mi>x</mi><mn>2</mn></msup><mi>y</mi><mtext>&nbsp;</mtext><mo>+</mo><mtext>&nbsp;</mtext><mn>2</mn><mi>x</mi><msup><mi>y</mi><mn>2</mn></msup></mrow><annotation encoding="application/x-tex">2x^2y\ +\ 2xy^2</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height: 1.00855em; vertical-align: -0.19444em;"></span><span class="mord">2</span><span class="mord"><span class="mord mathdefault">x</span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height: 0.814108em;"><span class="" style="top: -3.063em; margin-right: 0.05em;"><span class="pstrut" style="height: 2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight">2</span></span></span></span></span></span></span></span><span class="mord mathdefault" style="margin-right: 0.03588em;">y</span><span class="mspace" style="margin-right: 0.222222em;"></span><span class="mspace">&nbsp;</span><span class="mbin">+</span><span class="mspace" style="margin-right: 0.222222em;"></span><span class="mspace">&nbsp;</span></span><span class="base"><span class="strut" style="height: 1.00855em; vertical-align: -0.19444em;"></span><span class="mord">2</span><span class="mord mathdefault">x</span><span class="mord"><span class="mord mathdefault" style="margin-right: 0.03588em;">y</span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height: 0.814108em;"><span class="" style="top: -3.063em; margin-right: 0.05em;"><span class="pstrut" style="height: 2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight">2</span></span></span></span></span></span></span></span></span></span></span></span>﻿</span></p>',
      isRichEditor: false,
      id: 4,
      correct: true
    }];
    this.demoQ.tags = ['a', 'b', 'c'];
    this.submitBtnTxt = 'SUBMIT';
    this.actionBarTxt = 'Submit Question';
    this.initDataItems();
    this.question = new Question();
    this.subscriptions.push(this.store.select(appState.coreState).pipe(select(s => s.applicationSettings)).subscribe(appSettings => {
      if (appSettings) {
        this.applicationSettings = appSettings[0];
        // 'Select a max time',


        this.applicationSettings.game_play_max_time = [ ...this.applicationSettings.game_play_max_time];
        this.cd.markForCheck();
        this.createForm(this.question);
        this.answers = (<FormArray>this.questionForm.get('answers'));
      }
      this.cd.markForCheck();
    })
    );
    const questionControl = this.questionForm.get('questionText');

    this.subscriptions.push(questionControl.valueChanges.pipe(debounceTime(500)).subscribe(v => this.computeAutoTags()));
    this.subscriptions.push(this.answers.valueChanges.pipe(debounceTime(500)).subscribe(v => this.computeAutoTags()));

    this.subscriptions.push(store.select(appState.coreState).pipe(select(s => s.questionSaveStatus)).subscribe((status) => {
      if (status === 'SUCCESS') {
        this.store.dispatch(this.questionAction.resetQuestionSuccess());
        this.utils.showMessage('success', 'Question saved!');
        this.routerExtension.navigate(['/user/my/questions']);
        this.actionBarTxt = 'My Question';
        setTimeout(() => {
          this.hideQuestion.emit(false);
          this.toggleLoader(false);
        }, 0);
      }
      this.cd.markForCheck();
    }));

    this.questionForm.get('isRichEditor').valueChanges.subscribe(isRichEditor => {
      this.cd.markForCheck();
      this.questionForm.patchValue({ questionText: '' });

      if (isRichEditor) {
        this.questionForm.get('maxTime').setValidators(Validators.compose([Validators.required]));
        this.questionForm.get('questionText').setValidators(Validators.compose([Validators.required]));

      } else {
        this.questionForm.get('maxTime').setValidators([]);
        this.questionForm.get('questionText').setValidators(Validators.compose([Validators.required,
        Validators.maxLength(this.applicationSettings.question_max_length)]));

      }
      this.questionForm.get('maxTime').updateValueAndValidity();
      this.questionForm.get('questionText').updateValueAndValidity();
      setTimeout(() => {
        if (this.questionWebView) {
          const myWebViewInstance = this.questionWebView.nativeElement;
          if (!myWebViewInstance) {
          } else {
            // this.oWebViewInterface = new webViewInterfaceModule.WebViewInterface(myWebViewInstance, 'https://quill-js.firebaseapp.com');
            this.oWebViewInterface = new webViewInterfaceModule.WebViewInterface(myWebViewInstance, 'http://192.168.0.102:4201');
            this.oWebViewInterface.on(WebView.loadFinishedEvent, (args: LoadEventData) => {
            });

            this.oWebViewInterface.on('quillContent', (quillContent) => {

              this.questionForm.patchValue({ questionText: quillContent.html });
              this.questionForm.patchValue({ questionObject: quillContent.delta });
              this.cd.markForCheck();
            });

            this.oWebViewInterface.on('uploadImageStart', (uploadImage) => {
              dialogs.action({
                message: 'Choose option',
                cancelButtonText: 'Cancel',
                actions: ['Camera', 'Gallery']
              }).then(async result => {
                if (result === 'Camera') {
                  await this.uploadImageFromCamera(this.oWebViewInterface);
                } else if (result === 'Gallery') {
                  await this.uploadImageFromGallery(this.oWebViewInterface);
                }
                this.cd.markForCheck();
              });
            });
          }
        }
      }, 1000);
    });

    this.questionForm.get('answers').valueChanges.subscribe((changes) => {
      this.cd.markForCheck();
    });
  }

  public onchange(args: SelectedIndexChangedEventData) {
    this.selectedMaxTimeIndex = args.newIndex;
    this.questionForm.patchValue({ maxTime: this.applicationSettings.game_play_max_time[args.newIndex] });
  }

  checkboxChecked(i) {

    this.answers.controls[i]['controls'].answerText.patchValue('');
    this.answers.controls[i]['controls'].answerObject.patchValue('');
    setTimeout(() => {
      this.webView.toArray()
        .map((el, index) => {
          if (i === Number(el.nativeElement.id)) {
            const elementId = el.nativeElement.id;
            this.answers.controls[elementId]['controls'].answerText.patchValue('');
            this.answers.controls[elementId]['controls'].answerObject.patchValue('');
            el.nativeElement = new webViewInterfaceModule.WebViewInterface(el.nativeElement, 'http://192.168.0.102:4201');
            el.nativeElement.on('quillContent', (quillContent) => {
              this.answers.controls[elementId]['controls'].answerObject.patchValue(quillContent.delta);
              this.answers.controls[elementId]['controls'].answerText.patchValue(quillContent.html);
            });

            el.nativeElement.on('uploadImageStart', (uploadImage) => {
              dialogs.action({
                message: 'Choose option',
                cancelButtonText: 'Cancel',
                actions: ['Camera', 'Gallery']
              }).then(async result => {
                if (result === 'Camera') {
                  await this.uploadImageFromCamera(el.nativeElement);
                } else if (result === 'Gallery') {
                  await this.uploadImageFromGallery(el.nativeElement);
                }
              });
            });
          }
        });
    }, 1000);
  }
  async uploadImageFromCamera(webviewElement) {
    const options = {
      width: this.width,
      height: this.height,
      keepAspectRatio: this.keepAspectRatio,
      saveToGallery: this.saveToGallery
    };

    if (isAvailable()) {

      try {
        const imageAsset = await takePicture(options);
        this.imageTaken = imageAsset;
        const source = new ImageSource();
        const imageSource = await fromAsset(imageAsset);
        await this.cropImage(imageSource, webviewElement);

      } catch (error) {
        console.error(error);
      }
    }
  }

  async cropImage(imageSource, webviewElement) {
    try {
      const imageCropper: ImageCropper = new ImageCropper();
      const result: ImageSource = (await imageCropper.show(imageSource,
        { lockSquare: false })).image;
      if (result) {
        const image = `data:image/jpeg;base64,${result.toBase64String('jpeg', 100)}`;
        this.imagePath = image;
        this.questionService.saveQuestionImage(this.imagePath, 'ded').subscribe(imageObject => {
          if (imageObject != null) {
            if (imageObject.name) {
              const imageName = this.utils.getQuestionUrl(imageObject.name) + `?d=${new Date().getTime()}`;
              webviewElement.emit('imageUrl', imageName);
            }
          }
        });
      }
    } catch (error) {
      console.error(error);
    }
  }

  async uploadImageFromGallery(webviewElement) {
    try {
      let imageSource = new ImageSource();
      const context = imagepicker.create({
        mode: 'single' // use "multiple" for multiple selection
      });
      await context.authorize();
      const selection = await context.present();
      const imageAsset = selection.length > 0 ? selection[0] : null;
      imageAsset.options = {
        width: this.width,
        height: this.height,
        keepAspectRatio: true
      };
      imageSource = await fromAsset(imageAsset);
      this.cropImage(imageSource, webviewElement);
    } catch (error) {
      console.error(error);
    }


  }

  ngOnChanges() {
    if (this.editQuestion && this.applicationSettings) {
      this.createForm(this.editQuestion);
      this.categoryIds = this.editQuestion.categoryIds;
      this.categories = this.categories.map(categoryObj => {
        if (Number(categoryObj.id) === Number(this.categoryIds[0])) {
          categoryObj['isSelected'] = true;
        }
        return categoryObj;
      });
      this.enteredTags = this.editQuestion.tags;
      this.submitBtnTxt = 'RESUBMIT';
      this.actionBarTxt = 'Update Question';
    }


  }

  private initDataItems() {
    this.tagItems = new ObservableArray<TokenModel>();

    for (let i = 0; i < this.tags.length; i++) {
      this.tagItems.push(new TokenModel(this.tags[i], undefined));
    }
  }


  createForm(question: Question) {

    const answersFA: FormArray = super.createDefaultForm(question);

    this.questionForm = this.fb.group({
      questionText: [question.questionText,
      Validators.compose([Validators.required])],
      tags: '',
      answers: answersFA,
      ordered: [question.ordered],
      explanation: [question.explanation],
      isRichEditor: [false],
      maxTime: []
    }, { validator: questionFormValidator }
    );
  }


  selectCategory(category) {
    this.categoryIds = [];
    this.categories = this.categories.map(categoryObj => {
      categoryObj.isSelected = false;
      return categoryObj;
    });
    category.isSelected = (!category.isSelected) ? true : false;
    this.categoryIds.push(category.id);
  }

  addCustomTag() {
    this.hideKeyboard();
    super.addTag(this.customTag);
    this.customTag = '';
    this.autocomplete.autoCompleteTextView.resetAutoComplete();
  }

  public onDidAutoComplete(args) {
    this.customTag = args.text;
  }

  public onTextChanged(args) {
    this.customTag = args.text;
  }

  submit() {
    this.hideKeyboard();
    const question: Question = super.onSubmit();

    // tslint:disable-next-line:no-unused-expression
    (this.editQuestion) ? question.id = this.editQuestion.id : '';
    if (question && this.categoryIds.length > 0 && this.enteredTags.length > 2) {
      question.categoryIds = this.categoryIds;
      this.toggleLoader(true);
      // call saveQuestion
      this.saveQuestion(question);
    }
  }

  preview() {
    this.hideKeyboard();
    // const question: Question = super.onSubmit();
    // console.log(question);

    const options = {
      context: { question: this.demoQ },
      fullscreen: true,
      viewContainerRef: this.vcRef
    };
    this.modal.showModal(PreviewQuestionDialogComponent, options);
  }

  hideKeyboard() {
    this.textField
      .toArray()
      .map((el) => {
        if (isAndroid) {
          el.nativeElement.android.clearFocus();
        }
        return el.nativeElement.dismissSoftInput();
      });
  }

  ngOnDestroy() {

  }
}

// Custom Validators
function questionFormValidator(fg: FormGroup): { [key: string]: boolean } {
  const answers: Answer[] = fg.get('answers').value;
  if (fg.get('isRichEditor').value && (fg.get('maxTime').value === 0 || fg.get('maxTime').value === null)) {
    return { 'maxTimeNotSelected': true };
  }

  if (answers.filter(answer => answer.correct).length !== 1) {
    return { 'correctAnswerCountInvalid': true };
  }


}

