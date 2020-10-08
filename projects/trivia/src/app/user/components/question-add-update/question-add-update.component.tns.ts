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
import { AutoUnsubscribe } from 'shared-library/shared/decorators';
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
import { QuestionStatus } from 'shared-library/shared/model';

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
  categoryDropdown: ElementRef;

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
  isQFormValid: boolean;

  @Input() editQuestion: Question;
  @Input() displayBottomBar: Boolean = true;

  showEditQuestion = false;
  @Output() hideQuestion = new EventEmitter<boolean>();
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
    private cd: ChangeDetectorRef,
    public questionService: QuestionService,
    private ngZone: NgZone,
    private el: ElementRef
  ) {
    super(fb, store, utils, questionAction);
    this.isMobile = true;
    requestPermissions();
    this.submitBtnTxt = 'Submit';
    this.actionBarTxt = 'Add_Question';
    // this.initDataItems();
    this.question = new Question();
    this.isQFormValid = false;

    if (isIOS) {
      this.iqKeyboard = IQKeyboardManager.sharedManager();
      this.iqKeyboard.shouldResignOnTouchOutside = true;
    }
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.store
        .select(appState.coreState)
        .pipe(select(s => s.questionSaveStatus))
        .subscribe(status => {
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
        })
    );

    this.submitBtnTxt =
      (this.editQuestion && this.editQuestion.status === QuestionStatus.REQUIRED_CHANGE)
        ? 'Resubmit'
        : 'Submit';
    if (this.editQuestion) {
      this.isQFormValid = true;
      this.actionBarTxt = 'Update Question';
    }


  }

  ngAfterViewInit() {

  }

  async uploadImageFromCamera(webviewElement) {
    const options = {
      width: this.width,
      height: this.height,
      keepAspectRatio: this.keepAspectRatio,
      saveToGallery: this.saveToGallery
    };

    if (this.isCameraAvailable()) {
      try {
        const imageAsset = await this.takePicture(options);
        this.imageTaken = imageAsset;
        const source = new ImageSource();
        const imageSource = await this.fromAsset(imageAsset);
        setTimeout(() => {
          this.cropImage(imageSource, webviewElement);
        }, isIOS ? 250 : 0);
      } catch (error) {
        console.error(error);
      }
    }
  }

  isCameraAvailable(): Boolean {
    return isAvailable();
  }

  async takePicture(options) {
    return await takePicture(options);
  }

  async fromAsset(imageAsset) {
    return await ImageSource.fromAsset(imageAsset);
  }

  async getCroppedImage(imageSource): Promise<ImageSource> {
    const imageCropper: ImageCropper = new ImageCropper();
    return (
      await imageCropper.show(imageSource, {
        width: 150,
        height: 140,
        lockSquare: false
      })
    ).image;
  }

  async contextSelection() {
    const context = imagepicker.create({
      mode: 'single' // use "multiple" for multiple selection
    });
    await context.authorize();
    return await context.present();
  }

  async openDialog() {
    return await dialogs
      .action({
        message: 'Choose option',
        cancelButtonText: 'Cancel',
        actions: ['Camera', 'Gallery']
      });
  }

  async cropImage(imageSource, webviewElement) {
    try {
      const result: ImageSource = await this.getCroppedImage(imageSource);
      // console.log('result', result);
      if (result) {
        const image = `data:image/jpeg;base64,${result.toBase64String(
          'jpeg',
          100
        )}`;
 
        this.imagePath = image;
        // console.log("image>>",this.imagePath);
        this.subscriptions.push(
          this.questionService
            .saveQuestionImage(this.imagePath, '')
            .subscribe(imageObject => {
              if (imageObject != null) {
                if (imageObject.name) {
                  const imageName =
                    this.utils.getQuestionUrl(imageObject.name) +
                    `?d=${new Date().getTime()}`;
                  // webviewElement.emit('imageUrl', imageName);
                  this.oWebViewInterface.emit('imageUrl', imageName);
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
      const selection = await this.contextSelection();
      const imageAsset = selection.length > 0 ? selection[0] : null;
      imageAsset.options = {
        width: this.width,
        height: this.height,
        keepAspectRatio: true
      };
      imageSource = await this.fromAsset(imageAsset);
      setTimeout(() => {
        this.cropImage(imageSource, webviewElement);
      }, 1);
    } catch (error) {
      console.error(error);
    }
  }

  ngOnChanges() { }


  preview() {
    this.isShowPreview = true;
    this.oWebViewInterface.emit('getPreviewQuestion', 'getPreviewQuestion');
  }

  webViewLoaded(event) {
    if (!event.object) {
    } else {
      if (!this.oWebViewInterface) {
        this.oWebViewInterface = this.setWebInterface(event.object);
      }
      if (this.oWebViewInterface && isIOS) {
        event.object.initNativeView();
        // need to wait for the load to be finished before emit the value.
        setTimeout(() => {
          this.oWebViewInterface.emit(
            'viewType',
            this.currentWebViewParentId >= 0 ? "answer" : "question"
          );
        }, 1);
      }
    }
  }

  setWebInterface(webViewInstace) {
    const webInterface = new webViewInterfaceModule.WebViewInterface(
      webViewInstace,
      CONFIG.editorUrl
    );
    webInterface.on('editorLoadFinished', this.editorLoadFinished);

    webInterface.on('isFormValid', this.isFormValid);

    webInterface.on('quillContent', this.quillContent);

    webInterface.on('appIsLoaded', this.appIsLoaded);

    webInterface.on('question', this.webInterfaceQuestion);

    webInterface.on('deleteImageUrl', this.webInterfaceDeleteImageUrl);

    webInterface.on('previewQuestion', this.webInterfacePreviewQuestion);

    webInterface.on('uploadImageStart', uploadImage => {
      this.webInterfaceUploadImage(uploadImage, webInterface);
    });

    return webInterface;
  }

  editorLoadFinished = (editorLoadFinished) => {
    if (editorLoadFinished) {
      // change is not being detected.
      this.ngZone.run(() => {
        this.isWebViewLoaded = true;
        this.cd.markForCheck();
      });
    }
  }

  isFormValid = (isFormValid) => {
    if (isFormValid === true) {
      this.isQFormValid = true;
    } else {
      this.isQFormValid = false;
    }
    this.cd.detectChanges();
  }

  quillContent = (quillContent) => {
    if (this.currentWebViewParentId === -1) {
      this.questionForm
        .get('questionText')
        .patchValue(quillContent.html ? quillContent.html : '');
      this.questionForm.get('questionObject').patchValue(quillContent.delta);
    } else if (this.currentWebViewParentId >= 0) {
      const ansForm = (<FormArray>this.questionForm.controls['answers']).at(
        this.currentWebViewParentId
      );
      ansForm['controls'].answerText.patchValue(
        quillContent.html ? quillContent.html : ''
      );
      ansForm['controls'].answerObject.patchValue(quillContent.delta);
    }
  }

  appIsLoaded = (appIsLoaded) => {
    if (this.editQuestion) {
      this.oWebViewInterface.emit('editQuestion', this.editQuestion);
    } else {
      this.oWebViewInterface.emit('editQuestion', this.question);
    }
  }

  webInterfaceQuestion = (question) => {
    if (!question) {
      return false;
    }
    question.created_uid = this.user.userId;
    question.is_draft = false;
    question.status = this.getQuestionStatus(question);
    this.saveQuestion(question);
    this.isSaved = true;
  }

  webInterfaceDeleteImageUrl = (deleteImageUrl) => {
    if (deleteImageUrl) {
      this.store.dispatch(this.questionAction.deleteQuestionImage(deleteImageUrl));
    }
  }

  webInterfacePreviewQuestion = (previewQuestion) => {
    this.previewQuestion = previewQuestion;
    this.cd.markForCheck();
  }

  webInterfaceUploadImage = async (uploadImage, webInterface) => {
    try {
      const result = await this.openDialog();
      if (result === 'Camera') {
        await this.uploadImageFromCamera(webInterface);
      } else if (result === 'Gallery') {
        await this.uploadImageFromGallery(webInterface);
      }
      this.cd.markForCheck();
    } catch (error) {
      console.error(error);
    }
  }

  back(event) {
    if (this.isShowPreview) {
      this.isShowPreview = false;
    } else {
      this.hideQuestion.emit(true);
    }
  }


  getQuestionStatus(question) {
    if (!question.status) {
      return QuestionStatus.PENDING;
    } else if (question.status === QuestionStatus.REQUIRED_CHANGE) {
      return QuestionStatus.PENDING;
    }
    return question.status;
  }

  getQuestion() {
    this.oWebViewInterface.emit('getFormData', 'getFormData');

  }
  ngOnDestroy() {
    if (this.oWebViewInterface) {
      this.oWebViewInterface.off('editorLoadFinished');
      this.oWebViewInterface.off('isFormValid');
      this.oWebViewInterface.off('quillContent');
      this.oWebViewInterface.off('appIsLoaded');
      this.oWebViewInterface.off('question');
      this.oWebViewInterface.off('previewQuestion');
      this.oWebViewInterface.off('uploadImageStart');
    }
  }
}
