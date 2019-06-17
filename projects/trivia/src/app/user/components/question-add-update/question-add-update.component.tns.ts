import {
  Component, OnDestroy, ViewChild, Input, Output, EventEmitter, OnChanges,
  ViewChildren, QueryList, ElementRef, ChangeDetectionStrategy, ChangeDetectorRef, ViewContainerRef, AfterViewInit, OnInit
} from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl, Validators } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { RouterExtensions } from 'nativescript-angular/router';
import { Utils } from 'shared-library/core/services';
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
import { CONFIG } from 'shared-library/environments/environment';

@Component({
  selector: 'app-question-add-update',
  templateUrl: './question-add-update.component.html',
  styleUrls: ['./question-add-update.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

@AutoUnsubscribe({ 'arrayName': 'subscriptions' })
export class QuestionAddUpdateComponent extends QuestionAddUpdate implements OnDestroy, OnChanges, AfterViewInit, OnInit {

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
  public editorUrl = CONFIG.editorUrl;
  public selectedMaxTimeIndex = 0;
  public webViews = [];
  public playMaxTime = [];

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
    public utils: Utils,
    public questionAction: QuestionActions,
    private routerExtension: RouterExtensions,
    private page: Page, private cd: ChangeDetectorRef,
    public questionService: QuestionService,
    private modal: ModalDialogService,
    private vcRef: ViewContainerRef) {

    super(fb, store, utils, questionAction);
    requestPermissions();
    this.submitBtnTxt = 'SUBMIT';
    this.actionBarTxt = 'Submit Question';
    this.initDataItems();
    this.question = new Question();
    this.subscriptions.push(this.store.select(appState.coreState).pipe(select(s => s.applicationSettings)).subscribe(appSettings => {
      if (appSettings) {
        this.applicationSettings = appSettings[0];
        this.playMaxTime = ['Select a Max time', ...this.applicationSettings.game_play_max_time];
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
    });

    this.questionForm.get('answers').valueChanges.subscribe((changes) => {
      this.cd.markForCheck();
    });

  }

  ngOnInit(): void {
    if (this.editQuestion) {
      const maxTimeIndex = this.playMaxTime.findIndex(maxTime => {
        return maxTime === this.editQuestion.maxTime;
      });
      if (maxTimeIndex > 0) {
        this.selectedMaxTimeIndex = this.editQuestion.maxTime;
      }
    }

  }
  ngAfterViewInit() {
  }

  onLoadFinished(event, id) {

    if (id === -1) {
      if (this.oWebViewInterface && this.editQuestion) {
        this.oWebViewInterface.emit('deltaObject', this.editQuestion.questionObject);
      }

    } else {
      const webviews = this.webViews.filter(p => p.id === id);
      if (webviews.length === 1 && this.editQuestion) {
        webviews[0].element.emit('deltaObject', this.editQuestion.answers[id].answerObject);
      }
    }

  }

  public onchange(args: SelectedIndexChangedEventData) {
    this.selectedMaxTimeIndex = args.newIndex;
    this.questionForm.patchValue({ maxTime: this.applicationSettings.game_play_max_time[args.newIndex] });
  }

  questionChecked(i) {
    setTimeout(() => {
      if (this.questionWebView) {
        const myWebViewInstance = this.questionWebView.nativeElement;
        if (!myWebViewInstance) {
        } else {
          this.oWebViewInterface = new webViewInterfaceModule.WebViewInterface(myWebViewInstance, CONFIG.editorUrl);
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

            const webViewInterfaceObject = new webViewInterfaceModule.WebViewInterface(el.nativeElement, CONFIG.editorUrl);

            const webViewInterface = {
              id: i,
              element: webViewInterfaceObject
            };
            const fIndex = this.webViews.findIndex(view => view.id === i);
            if (fIndex >= 0) {
              this.webViews.splice(fIndex, 1);
            }
            this.webViews.push(webViewInterface);

            webViewInterfaceObject.on('quillContent', (quillContent) => {
              this.answers.controls[elementId]['controls'].answerObject.patchValue(quillContent.delta);
              this.answers.controls[elementId]['controls'].answerText.patchValue(quillContent.html);
            });

            webViewInterfaceObject.on('uploadImageStart', (uploadImage) => {
              dialogs.action({
                message: 'Choose option',
                cancelButtonText: 'Cancel',
                actions: ['Camera', 'Gallery']
              }).then(async result => {
                if (result === 'Camera') {
                  await this.uploadImageFromCamera(webViewInterfaceObject);
                } else if (result === 'Gallery') {
                  await this.uploadImageFromGallery(webViewInterfaceObject);
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
      isRichEditor: [question.isRichEditor],
      questionObject: [question.questionObject],
      maxTime: [question.maxTime]
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
    const question: Question = super.onSubmit();

    const options = {
      context: { question: question },
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

