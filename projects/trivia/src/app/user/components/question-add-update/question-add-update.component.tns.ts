import {
  Component,
  OnDestroy,
  ViewChild,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  NgZone,
  ViewChildren,
  QueryList,
  ElementRef,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewContainerRef,
  AfterViewInit,
  OnInit,
  ɵConsole,
  Renderer2
} from "@angular/core";
import { FormGroup, FormBuilder, FormArray, Validators } from "@angular/forms";
import { Store, select } from "@ngrx/store";
import { RouterExtensions } from "nativescript-angular/router";
import { Utils } from "shared-library/core/services";
import { AppState, appState } from "../../../store";
import { QuestionActions } from "shared-library/core/store/actions/question.actions";
import { Question, Answer, Category } from "shared-library/shared/model";
import { QuestionAddUpdate } from "./question-add-update";
import { debounceTime, filter } from "rxjs/operators";
import { ObservableArray } from "tns-core-modules/data/observable-array";
import { TokenModel } from "nativescript-ui-autocomplete";
import { RadAutoCompleteTextViewComponent } from "nativescript-ui-autocomplete/angular";
import { Page, isIOS, isAndroid } from "tns-core-modules/ui/page";
import { AutoUnsubscribe } from "ngx-auto-unsubscribe";
import { WebView, LoadEventData } from "tns-core-modules/ui/web-view";
import * as webViewInterfaceModule from "nativescript-webview-interface";
import * as imagepicker from "nativescript-imagepicker";
import * as dialogs from "tns-core-modules/ui/dialogs";
import { fromAsset } from "tns-core-modules/image-source";
import { ImageCropper } from "nativescript-imagecropper";
import { SegmentedBarItem } from "tns-core-modules/ui/segmented-bar";
import {
  isAvailable,
  requestPermissions,
  takePicture
} from "nativescript-camera";
import { ImageAsset } from "tns-core-modules/image-asset";
import { ImageSource } from "tns-core-modules/image-source";
import { QuestionService } from "shared-library/core/services";
import {
  SelectedIndexChangedEventData,
  DropDown
} from "nativescript-drop-down";
import { ModalDialogService } from "nativescript-angular/directives/dialogs";
import { CONFIG } from "shared-library/environments/environment";
import * as Platform from "tns-core-modules/platform";
import { isEmpty } from 'lodash';

declare var IQKeyboardManager;
declare var android: any;

@Component({
  selector: "app-question-add-update",
  templateUrl: "./question-add-update.component.html",
  styleUrls: ["./question-add-update.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})

@AutoUnsubscribe({ 'arrayName': 'subscriptions' })
export class QuestionAddUpdateComponent extends QuestionAddUpdate
  implements OnDestroy, OnChanges, AfterViewInit, OnInit {
  iqKeyboard: any;
  showSelectCategory = false;
  showSelectTag = false;
  dataItem;
  customTag: string;
  private tagItems: ObservableArray<TokenModel>;
  categoryIds: any[];
  submitBtnTxt: string;
  actionBarTxt: string;
  oWebViewInterface;
  webViewInterfaceObject;
  platform = Platform;

  imagePath: string;

  demoQ: Question = new Question();
  renderView = false;
  @ViewChild("categoryDropdown", { static: false })
  categoryDropdown: ElementRef;
  @ViewChild("timeDropdown", { static: false }) timeDropdown: ElementRef;

  public imageTaken: ImageAsset;
  public saveToGallery = true;
  public keepAspectRatio = true;
  public width = 200;
  public height = 200;
  public answers: any;

  public items: Array<SegmentedBarItem>;
  public selectedIndex = 0;
  tabsTitles: Array<string>;
  public editorUrl = CONFIG.editorUrl;
  public selectedMaxTimeIndex = 0;
  public webViews = [];
  public playMaxTime = [];
  showIds = [];
  currentWebViewParentId: number;
  theme: string;
  isShowPreview = false;
  previewQuestion: Question;

  @Input() editQuestion: Question;
  @Input() displayBottomBar: Boolean = true;

  showEditQuestion = false;
  @Output() hideQuestion = new EventEmitter<boolean>();
  @ViewChild("autocomplete", { static: false })
  autocomplete: RadAutoCompleteTextViewComponent;
  @ViewChildren("textField") textField: QueryList<ElementRef>;
  @ViewChild("webView", { static: false }) webView: ElementRef<WebView>;
  @ViewChild("questionStack", { static: false }) questionStack: ElementRef;
  @ViewChildren("answerStack") answerStack: QueryList<ElementRef>;
  @ViewChild("webViewParentStack", { static: false })
  webViewParentStack: ElementRef;
  isWebViewLoaded = false;
  get dataItems(): ObservableArray<TokenModel> {
    return this.tagItems;
  }

  // Constructor
  constructor(
    public fb: FormBuilder,
    public store: Store<AppState>,
    public utils: Utils,
    public questionAction: QuestionActions,
    private routerExtension: RouterExtensions,
    private page: Page,
    private cd: ChangeDetectorRef,
    public questionService: QuestionService,
    private modal: ModalDialogService,
    private vcRef: ViewContainerRef,
    private ngZone: NgZone,
    private renderer: Renderer2,
    private el: ElementRef
  ) {
    super(fb, store, utils, questionAction);
    this.isMobile = true;
    requestPermissions();
    this.submitBtnTxt = "Submit";
    this.actionBarTxt = "Add_Question";
    this.initDataItems();
    this.question = new Question();

    if (isIOS) {
      this.iqKeyboard = IQKeyboardManager.sharedManager();
      this.iqKeyboard.shouldResignOnTouchOutside = true;
    }
    this.subscriptions.push(
      this.store
        .select(appState.coreState)
        .pipe(select(s => s.applicationSettings),
          filter(u => { return !isEmpty(u); }))
        .subscribe(appSettings => {
          if (!isEmpty(appSettings)) {
            this.applicationSettings = appSettings[0];
            this.playMaxTime = [
              "Select a Max time",
              ...this.applicationSettings.game_play_max_time
            ];
            this.createForm(this.question);
            this.saveDraft();
            this.cd.markForCheck();
            this.answers = <FormArray>this.questionForm.get("answers");
          }
          this.cd.markForCheck();
        })
    );

  }

  ngOnInit(): void {
    this.renderView = true;
    this.page.on("navigatedFrom", () =>
      this.ngZone.run(() => {
        this.ngOnDestroy();
      })
    );
    const questionControl = this.questionForm.get("questionText");
    const answerControl = <FormArray>this.questionForm.controls["answers"];

    this.subscriptions.push(
      questionControl.valueChanges
        .pipe(debounceTime(500))
        .subscribe(v => this.computeAutoTags())
    );
    this.subscriptions.push(
      answerControl.valueChanges.pipe(debounceTime(500)).subscribe(v => {
        this.computeAutoTags();
      })
    );

    this.subscriptions.push(
      this.store
        .select(appState.coreState)
        .pipe(select(s => s.questionSaveStatus))
        .subscribe(status => {
          if (status === "SUCCESS") {
            this.store.dispatch(this.questionAction.resetQuestionSuccess());
            this.utils.showMessage("success", "Question saved!");
            this.routerExtension.navigate(["/user/my/questions"]);
            this.actionBarTxt = "My Question";
            setTimeout(() => {
              this.hideQuestion.emit(false);
              this.toggleLoader(false);
            }, 0);
          }
          this.cd.markForCheck();
        })
    );

    if (this.editQuestion) {
      const maxTimeIndex = this.playMaxTime.findIndex(maxTime => {
        return maxTime === this.editQuestion.maxTime;
      });
      if (maxTimeIndex > 0) {
        this.selectedMaxTimeIndex = this.editQuestion.maxTime;
      }
    }

    if (!this.displayBottomBar) {
      this.displayBottomBar = false;
    }
  }

  answerSelected(index) {
    const answer = <FormArray>this.questionForm.controls["answers"];
    setTimeout(() => {
      for (let counter = 0; counter < answer.length; counter++) {
        if (counter !== index) {
          const questionForm = (<FormArray>(
            this.questionForm.controls["answers"]
          )).at(counter);
          questionForm["controls"].correct.setValue(false);
          this.cd.markForCheck();
          this.cd.detectChanges();
        }
      }
    }, 1);
  }

  checkedChanged(event) {
    setTimeout(() => {
      this.cd.markForCheck();
    }, 25);
  }

  ngAfterViewInit() {
    // this.renderView = false;
    if (this.editQuestion && this.applicationSettings) {
      this.createForm(this.editQuestion);
      this.question.status = this.editQuestion.status;
      this.saveDraft();
      this.cd.markForCheck();
      this.categoryIds = this.editQuestion.categoryIds;

      this.enteredTags = this.editQuestion.tags;
      this.submitBtnTxt =
        this.editQuestion.is_draft === true && this.editQuestion.status !== 6
          ? "Submit"
          : "Resubmit";
      this.actionBarTxt = "Update Question";
    }
  }

  openCategoryDropdown() {
    const categoryDropdown = <DropDown>this.categoryDropdown.nativeElement;
    categoryDropdown.open();
  }

  openTimeDropdown() {
    const timeDropdown = <DropDown>this.timeDropdown.nativeElement;
    timeDropdown.open();
  }

  setInitialValue() {
    const blankObj = [{ insert: "" }];
    if (this.currentWebViewParentId >= 0) {
      const ansForm = (<FormArray>this.questionForm.controls["answers"]).at(
        this.currentWebViewParentId
      );
      ansForm["controls"].isRichEditor.patchValue(true);
      this.oWebViewInterface.emit(
        "deltaObject",
        ansForm["controls"].answerObject.value
          ? ansForm["controls"].answerObject.value
          : blankObj
      );
    } else if (this.currentWebViewParentId === -1) {
      this.questionForm.get("isRichEditor").patchValue(true);
      this.oWebViewInterface.emit(
        "deltaObject",
        this.questionForm.controls.questionObject.value
          ? this.questionForm.controls.questionObject.value
          : blankObj
      );
    }
  }
  showEditor(type: string, id = -1) {
    this.moveWebView(type, id);
    if (type === "question") {
      this.questionForm.patchValue({ isRichEditor: true });
    } else {
      const newQuestionForm = (<FormArray>(
        this.questionForm.controls["answers"]
      )).at(id);
      newQuestionForm["controls"].isRichEditor.setValue(true);
    }
  }

  moveWebView(type: string, id: number) {
    const prevWebViewParent =
      this.currentWebViewParentId !== undefined
        ? this.currentWebViewParentId === -1
          ? this.questionStack.nativeElement
          : this.answerStack.filter(
            (element, index) => index === this.currentWebViewParentId
          )[0].nativeElement
        : this.webViewParentStack.nativeElement;
    const nextWebViewParent =
      id === -1
        ? this.questionStack.nativeElement
        : this.answerStack.filter((element, index) => index === id)[0]
          .nativeElement;
    this.currentWebViewParentId = id;

    if (isAndroid) {
      this.webView.nativeElement.android.getSettings().setBuiltInZoomControls(false);
      // for android this works as this method does not destroy the webview. do not change.
      this.webView.nativeElement.android
        .getSettings()
        .setBuiltInZoomControls(false);
      prevWebViewParent._removeViewFromNativeVisualTree(
        this.webView.nativeElement
      );

      this.webView.nativeElement.android.getSettings().setBuiltInZoomControls(false);
      this.webView.nativeElement.android.setOnTouchListener(
        new android.view.View.OnTouchListener({
          onTouch: (view, motionEvent) => {
            var action = motionEvent.getAction();
            if (action === android.view.MotionEvent.ACTION_DOWN) {
              view.getParent().requestDisallowInterceptTouchEvent(true);
            }
            if (action === android.view.MotionEvent.ACTION_UP) {
              view.getParent().requestDisallowInterceptTouchEvent(false);
            }
            view.onTouchEvent(motionEvent);
            return true;
          }
        })
      );

      this.webView.nativeElement.android.getSettings().setBuiltInZoomControls(false);
      nextWebViewParent._addViewToNativeVisualTree(this.webView.nativeElement);
      // need to wait for the load to be finished before emit the value.
      setTimeout(() => {
        this.oWebViewInterface.emit(
          "viewType",
          this.currentWebViewParentId >= 0 ? "answer" : "question"
        );
        this.setInitialValue();
      }, 1);
    } else if (isIOS) {
      // for ios this works it calls destroy but still we can re initialize the communication by calling initNativeView(). do not change.
      this.renderer.removeChild(prevWebViewParent, this.webView.nativeElement);
      this.renderer.appendChild(nextWebViewParent, this.webView.nativeElement);
    }
  }

  public onchange(args: SelectedIndexChangedEventData) {
    this.selectedMaxTimeIndex = args.newIndex;
    this.questionForm.patchValue({
      maxTime: this.applicationSettings.game_play_max_time[args.newIndex - 1]
    });
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
      const result: ImageSource = (
        await imageCropper.show(imageSource, { lockSquare: false })
      ).image;
      if (result) {
        const image = `data:image/jpeg;base64,${result.toBase64String(
          "jpeg",
          100
        )}`;
        this.imagePath = image;
        this.subscriptions.push(
          this.questionService
            .saveQuestionImage(this.imagePath, "")
            .subscribe(imageObject => {
              if (imageObject != null) {
                if (imageObject.name) {
                  const imageName =
                    this.utils.getQuestionUrl(imageObject.name) +
                    `?d=${new Date().getTime()}`;
                  webviewElement.emit("imageUrl", imageName);
                }
              }
            })
        );
      }
    } catch (error) {
      console.error(error);
    }
  }

  async uploadImageFromGallery(webviewElement) {
    try {
      let imageSource = new ImageSource();
      const context = imagepicker.create({
        mode: "single" // use "multiple" for multiple selection
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
      setTimeout(() => {
        this.cropImage(imageSource, webviewElement);
      }, 1);
    } catch (error) {
      console.error(error);
    }
  }

  ngOnChanges() { }

  private initDataItems() {
    this.tagItems = new ObservableArray<TokenModel>();

    for (let i = 0; i < this.tags.length; i++) {
      this.tagItems.push(new TokenModel(this.tags[i], undefined));
    }
  }

  createForm(question: Question) {
    const answersFA: FormArray = super.createDefaultForm(question);
    if (question.categoryIds.length > 0) {
      this.selectedQuestionCategoryIndex = Number(question.categoryIds[0]);
    }

    if (question.maxTime) {
      const maxTimeIndex = this.applicationSettings.game_play_max_time.findIndex(
        data => data === question.maxTime
      );
      this.selectedMaxTimeIndex = maxTimeIndex + 1;
    }

    this.questionForm = this.fb.group(
      {
        id: question.id ? question.id : "",
        is_draft: question.is_draft,
        questionText: [
          question.questionText ? question.questionText : "",
          Validators.compose([Validators.required])
        ],
        tags: "",
        answers: answersFA,
        ordered: [question.ordered],
        explanation: [question.explanation],
        isRichEditor: [question.isRichEditor],
        questionObject: [question.questionObject],
        maxTime: [question.maxTime, Validators.required],
        category: [
          question.categoryIds.length > 0 ? question.categoryIds[0] : "",
          Validators.required
        ]
      },
      { validator: questionFormValidator }
    );
  }

  selectCategory(args: SelectedIndexChangedEventData) {
    this.selectedQuestionCategoryIndex = args.newIndex;
    this.categoryIds = [];
    const category: Category = this.categories[args.newIndex];
    this.questionForm.controls.category.patchValue(args.newIndex);
    if (category) {
      this.categoryIds.push(category.id);
    }
  }

  addCustomTag() {
    this.hideKeyboard();
    if (this.customTag && this.customTag !== "") {
      super.addTag(this.customTag);
      this.customTag = "";
      this.autocomplete.autoCompleteTextView.resetAutoComplete();
    }
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
    if (!question) {
      return false;
    }
    // tslint:disable-next-line:no-unused-expression
    this.editQuestion ? (question.id = this.editQuestion.id) : "";
    if (
      question &&
      this.categoryIds.length > 0 &&
      this.enteredTags.length > 2
    ) {
      question.categoryIds = this.categoryIds;
      this.toggleLoader(true);
      // call saveQuestion
      this.saveQuestion(question);
      this.isSaved = true;
    }
  }

  preview() {
    this.hideKeyboard();
    this.previewQuestion = super.onSubmit(true);
    this.isShowPreview = true;
  }

  hideKeyboard() {
    this.utils.hideKeyboard(this.textField);
  }

  ngOnDestroy() {
    this.renderView = false;
    if (this.oWebViewInterface) {
      this.oWebViewInterface.off("uploadImageStart");
      this.oWebViewInterface.off("quillContent");
      this.oWebViewInterface.off("editorLoadFinished");
    }
  }

  webViewLoaded(event) {
    if (!event.object) {
    } else {
      if (!this.oWebViewInterface) {
        this.oWebViewInterface = this.setWebInterface(event.object);
        //  new webViewInterfaceModule.WebViewInterface(event.object, CONFIG.editorUrl);
      }

      if (this.oWebViewInterface && isIOS) {
        event.object.initNativeView();
        // need to wait for the load to be finished before emit the value.
        setTimeout(() => {
          this.oWebViewInterface.emit(
            "viewType",
            this.currentWebViewParentId >= 0 ? "answer" : "question"
          );
          this.setInitialValue();
        }, 1);
      }
    }
  }

  preventEventPropogation() { }

  setWebInterface(webViewInstace) {
    const webInterface = new webViewInterfaceModule.WebViewInterface(
      webViewInstace,
      CONFIG.editorUrl
    );
    // new webViewInterfaceModule.WebViewInterface(webViewInstace, CONFIG.editorUrl);
    webInterface.on("editorLoadFinished", quillContent => {
      if (quillContent) {
        // change is not being detected.
        this.ngZone.run(() => {
          this.isWebViewLoaded = true;
          this.cd.markForCheck();
        });
      }
    });

    webInterface.on("quillContent", quillContent => {
      if (this.currentWebViewParentId === -1) {
        this.questionForm
          .get("questionText")
          .patchValue(quillContent.html ? quillContent.html : "");
        this.questionForm.get("questionObject").patchValue(quillContent.delta);
      } else if (this.currentWebViewParentId >= 0) {
        const ansForm = (<FormArray>this.questionForm.controls["answers"]).at(
          this.currentWebViewParentId
        );
        ansForm["controls"].answerText.patchValue(
          quillContent.html ? quillContent.html : ""
        );
        ansForm["controls"].answerObject.patchValue(quillContent.delta);
      }
    });

    webInterface.on("uploadImageStart", uploadImage => {
      dialogs
        .action({
          message: "Choose option",
          cancelButtonText: "Cancel",
          actions: ["Camera", "Gallery"]
        })
        .then(async result => {
          if (result === "Camera") {
            await this.uploadImageFromCamera(webInterface);
          } else if (result === "Gallery") {
            await this.uploadImageFromGallery(webInterface);
          }
          this.cd.markForCheck();
        });
    });

    return webInterface;
  }

  back(event) {
    if (this.isShowPreview) {
      this.isShowPreview = false;
    } else {
      this.hideQuestion.emit(true);
    }
  }
}

// Custom Validators
function questionFormValidator(fg: FormGroup): { [key: string]: boolean } {
  const answers: Answer[] = fg.get("answers").value;
  if (
    fg.get("isRichEditor").value &&
    (fg.get("maxTime").value === 0 || fg.get("maxTime").value === null)
  ) {
    return { maxTimeNotSelected: true };
  }

  if (answers.filter(answer => answer.correct).length !== 1) {
    return { correctAnswerCountInvalid: true };
  }
}
