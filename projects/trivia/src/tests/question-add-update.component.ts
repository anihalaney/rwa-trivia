import 'reflect-metadata';
import { ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import {
  nsTestBedAfterEach,
  nsTestBedBeforeEach,
  nsTestBedRender,
} from 'nativescript-angular/testing';
import { QuestionAddUpdateComponent } from './../app/user/components/question-add-update/question-add-update.component.tns';
import { NativeScriptFormsModule } from 'nativescript-angular/forms';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormControl, FormArray } from '@angular/forms';
import { StoreModule, MemoizedSelector, Store } from '@ngrx/store';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { HttpClientModule } from '@angular/common/http';
import { coreState, CoreState, ActionWithPayload, categoryDictionary } from 'shared-library/core/store';
import { Utils, WindowRef } from 'shared-library/core/services';
import * as webViewInterfaceModule from "nativescript-webview-interface";
import { testData } from 'test/data';
import { WebView, LoadEventData } from "tns-core-modules/ui/web-view";
import { GameActions, QuestionActions, UserActions } from 'shared-library/core/store/actions';
import { TimeAgoPipe } from 'time-ago-pipe';
import { CONFIG } from "shared-library/environments/environment";
import { RouterExtensions } from 'nativescript-angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { DOCUMENT } from '@angular/common';
import { NativeScriptRouterModule } from 'nativescript-angular/router';
import { User, Game, PlayerMode, GameStatus, OpponentType, Invitation } from 'shared-library/shared/model';
import { AppState, appState } from './../app/store';
import { DashboardState } from './../app/dashboard/store';
import { Router } from '@angular/router';
import { DbService } from 'shared-library/core/db-service';
import { QuestionService } from 'shared-library/core/services';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Question, QuestionStatus } from 'shared-library/shared/model';
import { Observable } from "tns-core-modules/data/observable";
import { ImageSource } from 'tns-core-modules/image-source';


describe('QuestionAddUpdateComponent', () => {
  const questionObject = () => {
    let question = new Question();
    question = testData.question;
    return question;
  };
  let component: QuestionAddUpdateComponent;
  let fixture: ComponentFixture<QuestionAddUpdateComponent>;
  let mockStore: MockStore<CoreState>;
  let spy: any;
  let mockCoreSelector: MemoizedSelector<CoreState, Partial<CoreState>>;
  let router: Router;
  const formBuilder: FormBuilder = new FormBuilder();
  const webViewObject: any = {
    editorLoadFinished: () => { },
    isFormValid: () => { },
    quillContent: () => { },
    appIsLoaded: () => { },
    question: () => { },
    deleteImageUrl: () => { },
    previewQuestion: () => { },
    uploadImageStart: () => { },
  };

  afterEach(nsTestBedAfterEach());
  beforeEach(nsTestBedBeforeEach(
    [QuestionAddUpdateComponent],
    [provideMockStore({
      initialState: {},
      selectors: [
        {
          selector: appState.coreState,
          value: {}
        },
        {
          selector: categoryDictionary,
          value: {}
        }
      ],
    },
    ),
      QuestionActions,
      QuestionService,
      DbService,
      Utils,
      WindowRef,
    { provide: FormBuilder, useValue: formBuilder },
    ],
    [ReactiveFormsModule, FormsModule, StoreModule.forRoot({}),
      RouterTestingModule.withRoutes([]), HttpClientModule, BrowserAnimationsModule]
  ));

  beforeEach((async () => {
    fixture = await nsTestBedRender(QuestionAddUpdateComponent);
    mockStore = TestBed.get(Store);
    component = fixture.componentInstance;
    mockCoreSelector = mockStore.overrideSelector<CoreState, Partial<CoreState>>(coreState, {});
    spy = spyOn(mockStore, 'dispatch');
    router = TestBed.get(Router);
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Initial values should be set', () => {
    expect(component.showSelectCategory).toBeFalsy();
    expect(component.showSelectTag).toBeFalsy();
    expect(component.renderView).toBeFalsy();
    expect(component.isShowPreview).toBeFalsy();
    expect(component.showEditQuestion).toBeFalsy();
    expect(component.isWebViewLoaded).toBeFalsy();

    expect(component.iqKeyboard).toBeFalsy();
    expect(component.dataItem).toBeFalsy();
    expect(component.categoryIds).toBeFalsy();
    expect(component.submitBtnTxt).toBeFalsy();
    expect(component.actionBarTxt).toBeFalsy();
    expect(component.oWebViewInterface).toBeFalsy();
    expect(component.webViewInterfaceObject).toBeFalsy();
    expect(component.imagePath).toBeFalsy();
    expect(component.imageTaken).toBeTruthy();
    expect(component.items).toBeFalsy();
    expect(component.iqKeyboard).toBeFalsy();
    expect(component.demoQ).toBeTruthy();
    expect(component.saveToGallery).toBeTruthy();
    expect(component.keepAspectRatio).toBeTruthy();
    expect(component.width).toBeTruthy();
    expect(component.height).toBeTruthy();
    expect(component.answers).toBeFalsy();
    expect(component.selectedIndex).toBeTruthy();
    expect(component.tabsTitles).toBeFalsy();
    expect(component.editorUrl).toBeTruthy();
    expect(component.selectedMaxTimeIndex).toBeTruthy();
    expect(component.webViews).toBeFalsy();
    expect(component.playMaxTime).toBeFalsy();
    expect(component.showIds).toBeFalsy();
    expect(component.currentWebViewParentId).toBeFalsy();
    expect(component.theme).toBeFalsy();
    expect(component.previewQuestion).toBeFalsy();
    expect(component.isQFormValid).toBeFalsy();
  });

  it('On constructor set default value', () => {
    expect(component.isMobile).toBe(true);
    expect(component.submitBtnTxt).toBe('Submit');
    expect(component.actionBarTxt).toBe('Add_Question');
    expect(component.isQFormValid).toBe(false);
  });

  it('If platform is IOS it should set the iqKeyboard and outside click should close the keyboard', () => {
    expect(component.iqKeyboard.shouldResignOnTouchOutside).toBe(true);
  });

  it('Reset action should dispatch when store emit questionSaveStatus', () => {
    spyOn(component.hideQuestion, 'emit');
    mockCoreSelector.setResult({ questionSaveStatus: 'SUCCESS' });
    const navigateSpy = spyOn(router, 'navigate');
    spy.and.callFake((action: ActionWithPayload<null>) => {
      expect(action.type).toEqual(QuestionActions.RESET_QUESTION_SUCCESS);
    });

    mockStore.refreshState();
    expect(mockStore.dispatch).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith(['/user/my/questions']);
    expect(component.hideQuestion.emit).toHaveBeenCalledWith(false);
    expect(component.toggleLoader).toHaveBeenCalledWith(false);
  });

  it('Submit button text and action bar should be set', () => {
    expect(component.submitBtnTxt).toBe('Submit');
    expect(component.isQFormValid).toBe(true);
    expect(component.actionBarTxt).toBe('Update Question');
  });

  it('call to preview should set show preview and should emit getPreviewQuestion event', () => {
    expect(component.isShowPreview).toBe(true);
    spy = spyOn(component, 'preview').and.callThrough();
    expect(spy);
    component.preview();
    expect(component.oWebViewInterface.emit).toHaveBeenCalledWith(['getPreviewQuestion', 'getPreviewQuestion']);
  });

  it('call to webViewLoaded should call setWebInterface method if oWebViewInterface is falsy', () => {
    component.oWebViewInterface = {};
    component.webViewLoaded({ object: {} });
    expect(component.setWebInterface).toHaveBeenCalledWith({ object: {} });
  });

  it('call to webViewLoaded should emit viewType if oWebViewInterface is truthy and platform is iOS', () => {
    component.webViewLoaded({ object: {} });
    expect(component.oWebViewInterface.emit).toHaveBeenCalledWith(['viewType', 'answer']);
  });

  it('uploadImageStart event should get image from camera', fakeAsync(async () => {
    const webInterface = new webViewInterfaceModule.WebViewInterface(
      webViewObject,
      CONFIG.editorUrl
    );
    const spyOpenDialog = spyOn(component, 'openDialog').and.returnValue(Promise.resolve('Camera'));
    const spyuploadImageFromCamera = spyOn(component, 'uploadImageFromCamera').and.returnValue('');
    webInterface.on('uploadImageStart', (uploadImage) => { });
    await spyOpenDialog.calls.mostRecent().returnValue;
    expect(spyuploadImageFromCamera).toHaveBeenCalledTimes(1);
  }));

  it('uploadImageStart event should get image from gallery', fakeAsync(async () => {
    const webInterface = new webViewInterfaceModule.WebViewInterface(
      webViewObject,
      CONFIG.editorUrl
    );
    const spyOpenDialog = spyOn(component, 'openDialog').and.returnValue(Promise.resolve('Gallery'));
    const uploadImageFromGallery = spyOn(component, 'uploadImageFromGallery').and.returnValue('');
    webInterface.on('uploadImageStart', (uploadImage) => { });
    await spyOpenDialog.calls.mostRecent().returnValue;
    expect(uploadImageFromGallery).toHaveBeenCalledTimes(1);
  }));

  it('editorLoadFinished event should set isWebViewLoaded true', fakeAsync(async () => {
    const webInterface = new webViewInterfaceModule.WebViewInterface(
      webViewObject,
      CONFIG.editorUrl
    );
    webInterface.on('editorLoadFinished', (quillContent) => {
      expect(component.isWebViewLoaded).toEqual(true);
    });
  }));

  it('isFormValid event should set isQFormValid', fakeAsync(async () => {
    const webInterface = new webViewInterfaceModule.WebViewInterface(
      webViewObject,
      CONFIG.editorUrl
    );
    webInterface.on('isFormValid', (isFormValid) => {
      expect(component.isQFormValid).toEqual(isFormValid);
    });
  }));

  it('quillContent event should set questionText and questionObject', fakeAsync(async () => {
    component.currentWebViewParentId = -1;
    const webInterface = new webViewInterfaceModule.WebViewInterface(
      webViewObject,
      CONFIG.editorUrl
    );
    webInterface.on('quillContent', (quillContent) => {
      expect(component.questionForm.get('questionText').value).toBe(quillContent.html);
      expect(component.questionForm.get('questionObject').value).toBe(quillContent.delta);
    });
  }));

  it('quillContent event should set answerText and answerObject at currentWebViewParentId', fakeAsync(async () => {
    component.currentWebViewParentId = 1;
    const webInterface = new webViewInterfaceModule.WebViewInterface(
      webViewObject,
      CONFIG.editorUrl
    );
    webInterface.on('quillContent', (quillContent) => {
      expect(component.questionForm.get('answers').value[1].answerText).toBe(quillContent.html);
      expect(component.questionForm.get('answers').value[1].answerObject).toBe(quillContent.delta);
    });
  }));

  it('appIsLoaded event should emit the editQuestion event', fakeAsync(async () => {
    component.editQuestion = questionObject();
    const webInterface = new webViewInterfaceModule.WebViewInterface(
      webViewObject,
      CONFIG.editorUrl
    );
    webInterface.on('appIsLoaded', (appIsLoaded) => {
      spy = spyOn(component.oWebViewInterface, 'emit');
      expect(component.oWebViewInterface.emit).toHaveBeenCalledWith(['editQuestion', component.editQuestion]);
    });
  }));

  it('appIsLoaded event should emit the editQuestion event', fakeAsync(async () => {
    component.editQuestion = null;
    component.question = questionObject();
    const webInterface = new webViewInterfaceModule.WebViewInterface(
      webViewObject,
      CONFIG.editorUrl
    );
    webInterface.on('appIsLoaded', (appIsLoaded) => {
      spy = spyOn(component.oWebViewInterface, 'emit');
      expect(component.oWebViewInterface.emit).toHaveBeenCalledWith(['editQuestion', component.question]);
    });
  }));

  it('question event should set the question status and should call saveQuestion', fakeAsync(async () => {
    component.question = questionObject();
    const webInterface = new webViewInterfaceModule.WebViewInterface(
      webViewObject,
      CONFIG.editorUrl
    );
    webInterface.on('question', (question) => {
      const spyOngetQuestionStatus = spyOn(component, 'getQuestionStatus').and.callThrough();
      const spyOnsaveQuestion = spyOn(component, 'saveQuestion').and.callThrough();
      expect(spyOngetQuestionStatus).toHaveBeenCalledWith(question);
      expect(spyOnsaveQuestion).toHaveBeenCalledWith(question);
      expect(component.isSaved).toEqual(true);
    });
  }));

  it('deleteImageUrl event should dispatch event for delete question image ', fakeAsync(async () => {
    const event = {
      delta: [{ insert: 'hello' }],
      html: '<p>hello</p>',
      imageParsedName: 'image.png'
    };
    const webInterface = new webViewInterfaceModule.WebViewInterface(
      webViewObject,
      CONFIG.editorUrl
    );
    webInterface.on('deleteImageUrl', (deleteImageUrl) => {
      spy.and.callFake((action: ActionWithPayload<string>) => {
        expect(action.type).toEqual(QuestionActions.DELETE_QUESTION_IMAGE);
        expect(action.payload).toEqual(event.imageParsedName);
      });
      expect(mockStore.dispatch).toHaveBeenCalled();
    });
  }));

  it('previewQuestion event should set previewQuestion ', fakeAsync(async () => {
    const webInterface = new webViewInterfaceModule.WebViewInterface(
      webViewObject,
      CONFIG.editorUrl
    );
    webInterface.on('previewQuestion', (previewQuestion) => {
      expect(component.previewQuestion).toEqual(previewQuestion);
    });
  }));


  it('call to uploadImageFromCamera should capture image from camera and call takePicture and cropImage function', fakeAsync(async () => {
    component.width = 200;
    component.height = 200;
    component.keepAspectRatio = true;
    component.saveToGallery = true;
    const options = { width: 200, height: 200, keepAspectRatio: true, saveToGallery: true };
    const webInterface = new webViewInterfaceModule.WebViewInterface(
      webViewObject,
      CONFIG.editorUrl
    );
    const imageSource = ImageSource.
      fromBase64('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==');
    const spyOnIsCameraAvailable = spyOn(component, 'isCameraAvailable').and.returnValue(true);
    const spyOnFromAsset = spyOn(component, 'fromAsset').and.returnValue(Promise.resolve(true));
    const spyOnTakePicture = spyOn(component, 'takePicture').and.returnValue(Promise.resolve({ imageSource }));
    const spyOnCropImage = spyOn(component, 'cropImage').and.returnValue('');

    component.uploadImageFromCamera(webInterface);
    await spyOnTakePicture.calls.mostRecent().returnValue;
    await spyOnFromAsset.calls.mostRecent().returnValue;
    tick(500);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(spyOnCropImage).toHaveBeenCalledTimes(1);
  }));

  it('Verify the on call cropImage it should save image', fakeAsync(async () => {
    const imageSource = ImageSource.fromBase64('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==');
    const spyGetCroppedImage = spyOn(component, 'getCroppedImage').and.returnValue(Promise.resolve({
      toBase64String: () => {
        return '';
      }
    }));
    const files = [new File([
      new ArrayBuffer(2e+5)],
      'Mac_Apple.jpg',
      {
          lastModified: null,
          type: 'image/jpeg'
      })]
    const webInterface = new webViewInterfaceModule.WebViewInterface(
      webViewObject,
      CONFIG.editorUrl
    );
    const spyOnsaveQuestionImage = spyOn(component.questionService, 'saveQuestionImage').and.returnValue(files[0]);
    component.cropImage(imageSource, webInterface);
    await spyGetCroppedImage.calls.mostRecent().returnValue;
    expect(spyOnsaveQuestionImage).toHaveBeenCalledTimes(1);
  }));

  it('Verify the on call cropImage it should save image', fakeAsync(async () => {
    const spyGetCroppedImage = spyOn(component, 'contextSelection').and.returnValue(Promise.resolve([{
      imageAsset: {}
    }]));
    const webInterface = new webViewInterfaceModule.WebViewInterface(
      webViewObject,
      CONFIG.editorUrl
    );
    const spyOnFromAsset = spyOn(component, 'fromAsset').and.returnValue(Promise.resolve(true));
    const spyOnCropImage = spyOn(component, 'cropImage').and.returnValue('');

    component.uploadImageFromGallery(webInterface);
    await spyGetCroppedImage.calls.mostRecent().returnValue;
    await spyOnFromAsset.calls.mostRecent().returnValue;
    tick(500);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(spyOnCropImage).toHaveBeenCalledTimes(1);
  }));


  it('call to setWebInterface and register events for webInterface', () => {
    const webInterface = new webViewInterfaceModule.WebViewInterface(
      webViewObject,
      CONFIG.editorUrl
    );
    const loadevent: LoadEventData = {
      url: 'https://www.nativescript.org/?height200',
      navigationType: 'linkClicked', error: '', eventName: '', object: webViewObject
    };
    const returnWebInterface = component.setWebInterface(loadevent.object);
    expect(webInterface).toBe(webInterface);
  });

  it('call to setWebInterface and register events for webInterface', () => {
    const webInterface = new webViewInterfaceModule.WebViewInterface(
      webViewObject,
      CONFIG.editorUrl
    );
    const loadevent: LoadEventData = {
      url: 'https://www.nativescript.org/',
      navigationType: 'linkClicked', error: '', eventName: '', object: webViewObject
    };
    const returnWebInterface = component.setWebInterface(loadevent.object);
    expect(webInterface).toBe(webInterface);
  });

  it('call to getQuestionStatus should return question status if question`s status is not set', () => {
    const question = questionObject();
    question.status = null;
    const questionStatus = component.getQuestionStatus(question);
    expect(questionStatus).toBe(QuestionStatus.PENDING);
  });

  it('call to getQuestionStatus should return question status if not question`s status is REQUIRED_CHANGE', () => {
    const question = questionObject();
    question.status = QuestionStatus.REQUIRED_CHANGE;
    const questionStatus = component.getQuestionStatus(question);
    expect(questionStatus).toBe(QuestionStatus.PENDING);
  });


  it('call to back should emit hideQuestion event', () => {
    component.isShowPreview = false;
    spy = spyOn(component, 'preview').and.callThrough();
    expect(spy);
    component.back('');
    expect(component.hideQuestion.emit).toHaveBeenCalledWith(true);
  });


  it('call to back should set isShowPreview', () => {
    component.isShowPreview = true;
    component.back('');
    expect(component.isShowPreview).toEqual(false);
  });


  it('call to getQuestion should emit getFormData event of oWebViewInterface ', () => {
    component.getQuestion();
    expect(component.oWebViewInterface.emit).toHaveBeenCalledWith(['getFormData', 'getFormData']);
  });


  it(`Form should have correctAnswerCountInvalid error when only one answer is not selected `, () => {
    const answers = (<FormArray>component.questionForm.get('answers'));
    answers.controls[3]['controls'].correct.setValue(false);
    expect(component.questionForm.hasError('correctAnswerCountInvalid')).toBeTruthy();
  });

  it(`Form should have maxTimeNotSelected error when isRichEditor is true and maxTime param falsy`, () => {
    component.questionForm.get('maxTime').setValue(0);
    component.questionForm.get('isRichEditor').setValue(true);
    expect(component.questionForm.get('maxTime').errors).toEqual({ 'required': true });
    expect(component.questionForm.hasError('maxTimeNotSelected')).toBeTruthy();
  });


  it(`call to ngOnDestroy should off all the oWebViewInterface events `, () => {
    expect(component.oWebViewInterface.off).toHaveBeenCalledWith('editorLoadFinished');
    expect(component.oWebViewInterface.off).toHaveBeenCalledWith('isFormValid');
    expect(component.oWebViewInterface.off).toHaveBeenCalledWith('quillContent');
    expect(component.oWebViewInterface.off).toHaveBeenCalledWith('appIsLoaded');
    expect(component.oWebViewInterface.off).toHaveBeenCalledWith('question');
    expect(component.oWebViewInterface.off).toHaveBeenCalledWith('previewQuestion');
    expect(component.oWebViewInterface.off).toHaveBeenCalledWith('uploadImageStart');
  });

});
