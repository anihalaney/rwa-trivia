import 'reflect-metadata';
import { ComponentFixture, TestBed, tick, fakeAsync, flush } from '@angular/core/testing';
import {
  nsTestBedAfterEach,
  nsTestBedBeforeEach,
  nsTestBedRender,
} from 'nativescript-angular/testing';
import { QuestionAddUpdateComponent } from './../app/user/components/question-add-update/question-add-update.component.tns';
import { StoreModule, Store, MemoizedSelector } from '@ngrx/store';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { testData } from 'test/data';
import { GameActions, QuestionActions, UserActions } from 'shared-library/core/store/actions';
import { RouterTestingModule } from '@angular/router/testing';
import { NativeScriptRouterModule } from 'nativescript-angular/router';
import { User, Question, QuestionStatus } from 'shared-library/shared/model';
import { AppState, appState } from './../app/store';
import { userState } from './../app/user/store';
import { Router } from '@angular/router';
import { coreState, CoreState, ActionWithPayload } from 'shared-library/core/store';
import { FormBuilder } from '@angular/forms';
import { Utils, QuestionService } from 'shared-library/core/services';
import { HttpClientModule } from '@angular/common/http';
import { DbService } from 'shared-library/core/db-service';
import { isIOS } from 'tns-core-modules/ui/page';
import { ImageSource } from 'tns-core-modules/image-source';
import { CONFIG } from 'shared-library/environments/environment';
import * as webViewInterfaceModule from 'nativescript-webview-interface';
import * as userActions from './../app/user/store/actions';
import { of } from 'rxjs';

describe('QuestionAddUpdateComponent', () => {
  let component: QuestionAddUpdateComponent;
  let fixture: ComponentFixture<QuestionAddUpdateComponent>;
  let router: Router;
  let spy: any;
  let mockStore: MockStore<AppState>;
  const formBuilder: FormBuilder = new FormBuilder();
  let mockCoreSelector: MemoizedSelector<CoreState, Partial<CoreState>>;
  const originalQuestion: Question = {
    isRichEditor: true,
    id: '',
    answers:
      [{
        answerText: 'A',
        correct: null,
        isRichEditor: false,
        answerObject: null
      },
      {
        answerText: 'B',
        correct: null,
        isRichEditor: false,
        answerObject: null
      },
      {
        answerText: 'C',
        correct: null,
        isRichEditor: false,
        answerObject: null
      },
      {
        answerText: 'D',
        correct: true,
        isRichEditor: false,
        answerObject: null
      }],
    ordered: false,
    tags: [],
    categories: [],
    categoryIds: [],
    published: false,
    status: 0,
    validationErrorMessages: [],
    is_draft: false,
    questionText: '',
    explanation: '',
    createdOn: new Date(),
    maxTime: 8,
    questionObject: ''
  };

  const webViewObject: any = {
    editorLoadFinished: () => { },
    isFormValid: () => { },
    quillContent: () => { },
    appIsLoaded: () => { },
    question: () => { },
    deleteImageUrl: () => { },
    previewQuestion: () => { },
    uploadImageStart: () => { },
    ios: {
      stringByEvaluatingJavaScriptFromString: () => {
      }
    },
    on: () => { },
    evaluateJavascript : {},
    emit: () => {}
  };
  afterEach(nsTestBedAfterEach());
  beforeEach(nsTestBedBeforeEach(
    [QuestionAddUpdateComponent],
    [GameActions, UserActions, QuestionActions,
      {
        provide: QuestionService,
        useValue: {
          saveQuestionImage(image: string) {
            return of({ name: 'image.png' });
          }
        }
      },
      DbService,
      provideMockStore({
        selectors: [
          {
            selector: appState.coreState,
            value: {}
          },
          {
            selector: userState,
            value: {}
          }
        ]
      }),
      { provide: FormBuilder, useValue: formBuilder },
      {
        provide: Utils,
        useValue: {
          showMessage(type: string, message: string) {
            return '';
          },
          getQuestionUrl(imageName: string) {
            return imageName;
          }
        }
      },
    ],
    [StoreModule.forRoot({}), [RouterTestingModule.withRoutes([]),
    NativeScriptRouterModule.forRoot([])], HttpClientModule]
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


  it('On constructor set default value', () => {
    expect(component.isMobile).toBe(true);
    expect(component.submitBtnTxt).toBe('Submit');
    expect(component.actionBarTxt).toBe('Add_Question');
    expect(component.isQFormValid).toBe(false);
  });

  it('Reset action should dispatch when store emit questionSaveStatus', fakeAsync(() => {
    spyOn(component.hideQuestion, 'emit');
    const spyOnToggleLoader = spyOn(component, 'toggleLoader');
    mockCoreSelector.setResult({ questionSaveStatus: 'SUCCESS' });
    const navigateSpy = spyOn(router, 'navigate');
    spy.and.callFake((action: ActionWithPayload<null>) => {
      expect(action.type).toEqual(QuestionActions.RESET_QUESTION_SUCCESS);
    });

    mockStore.refreshState();
    tick(0);
    expect(mockStore.dispatch).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith(['/user/my/questions'], undefined);
    expect(component.hideQuestion.emit).toHaveBeenCalledWith(false);
    expect(spyOnToggleLoader).toHaveBeenCalledWith(false);
  }));

  it('If platform is IOS it should set the iqKeyboard and outside click should close the keyboard', () => {
    if (isIOS) {
    expect(component.iqKeyboard.shouldResignOnTouchOutside).toBe(true);
    }
  });

  it('Submit button text and action bar should be set', () => {
    expect(component.submitBtnTxt).toBe('Submit');
    expect(component.isQFormValid).toBe(false);
    expect(component.actionBarTxt).toBe('Add_Question');
  });

  it('call to preview should set show preview and should emit getPreviewQuestion event', () => {

    spyOn(component.oWebViewInterface, 'emit');
    component.preview();
    expect(component.isShowPreview).toBe(true);
    expect(component.oWebViewInterface.emit).toHaveBeenCalledWith('getPreviewQuestion', 'getPreviewQuestion');
  });

  it('call to webViewLoaded should call setWebInterface method if oWebViewInterface is not set', fakeAsync(() => {
    spyOn(component.oWebViewInterface, 'emit');
    const webViewObj = { object: { initNativeView: () => { } } };
    component.webViewLoaded(webViewObj);
    tick(1);
    if (isIOS) {
      expect(component.oWebViewInterface.emit).toHaveBeenCalledWith('viewType', 'question');
    }
    expect(component.oWebViewInterface).not.toBeNull();
  }));

  it('call to isFormValid is should set true to isQFormValid', () => {
    component.isFormValid(true);
    expect(component.isQFormValid).toBeTruthy();
  });

  it('call to isFormValid is should set false to isQFormValid', () => {
    component.isFormValid(false);
    expect(component.isQFormValid).toBeFalsy();
  });

  it('call to appIsLoaded, oWebViewInterface should emit question', () => {
    spyOn(component.oWebViewInterface, 'emit');
    component.question = originalQuestion;
    component.appIsLoaded('appIsLoaded');
    expect(component.oWebViewInterface.emit).toHaveBeenCalledWith('editQuestion', originalQuestion);
  });

  it('call to appIsLoaded, oWebViewInterface should emit edit question', () => {
    spyOn(component.oWebViewInterface, 'emit');
    component.editQuestion = originalQuestion;
    component.appIsLoaded('appIsLoaded');
    expect(component.oWebViewInterface.emit).toHaveBeenCalledWith('editQuestion', originalQuestion);
  });

  it('call to webInterfaceQuestion, it should return false as we question is not passed', () => {
    const isQuestionPassed = component.webInterfaceQuestion('');
    expect(isQuestionPassed).toBeFalsy();
  });

  it('call to webInterfaceQuestion, it should save question', () => {
    const spyOnSaveQuestion = spyOn(component, 'saveQuestion');
    component.user = testData.userList[0];
    const editQuestion = originalQuestion;
    component.webInterfaceQuestion(editQuestion);
    expect(spyOnSaveQuestion).toHaveBeenCalledTimes(1);
  });


  it('call to webInterfaceDeleteImageUrl, it should dispatch event for delete question image', () => {
    const deleteUrl = 'imageName.png';
    spy.and.callFake((action: ActionWithPayload<string>) => {
      expect(action.type).toEqual(QuestionActions.DELETE_QUESTION_IMAGE);
      expect(action.payload).toEqual(deleteUrl);
    });
    component.webInterfaceDeleteImageUrl(deleteUrl);
    expect(mockStore.dispatch).toHaveBeenCalled();
  });

  it('call to webInterfacePreviewQuestion, it should set preview question', () => {
    const question = originalQuestion;
    component.webInterfacePreviewQuestion(question);
    expect(component.previewQuestion).toEqual(question);
  });


  it('call to back should emit hideQuestion event', () => {
    component.isShowPreview = false;
    spyOn(component.hideQuestion, 'emit');
    component.back('');
    expect(component.hideQuestion.emit).toHaveBeenCalledWith(true);
  });

  it('call to back should set isShowPreview', () => {
    component.isShowPreview = true;
    component.back('');
    expect(component.isShowPreview).toEqual(false);
  });

  it('call to getQuestionStatus should return question status if question`s status is not set', () => {
    const question = originalQuestion;
    question.status = null;
    const questionStatus = component.getQuestionStatus(question);
    expect(questionStatus).toBe(QuestionStatus.PENDING);
  });

  it('call to getQuestionStatus should return question status if not question`s status is REQUIRED_CHANGE', () => {
    const question = originalQuestion;
    question.status = QuestionStatus.REQUIRED_CHANGE;
    const questionStatus = component.getQuestionStatus(question);
    expect(questionStatus).toBe(QuestionStatus.PENDING);
  });

  it('call to getQuestion should emit getFormData event of oWebViewInterface ', () => {
    spyOn(component.oWebViewInterface, 'emit');
    component.getQuestion();
    expect(component.oWebViewInterface.emit).toHaveBeenCalledWith('getFormData', 'getFormData');
  });


  it('Verify the on call uploadImageFromCamera it should call cropImage function', fakeAsync(async () => {
    // tslint:disable-next-line: max-line-length
    const imageSource = ImageSource.fromBase64('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==');
    const spyOnIsCameraAvailable = spyOn(component, 'isCameraAvailable').and.returnValue(true);
    const spyOnFromAsset = spyOn(component, 'fromAsset').and.returnValue(Promise.resolve(true));
    const spyOnTakePicture = spyOn(component, 'takePicture').and.returnValue(Promise.resolve({ imageSource }));
    const spyOnCropImage = spyOn(component, 'cropImage').and.returnValue('');

    const webInterface = new webViewInterfaceModule.WebViewInterface(
      webViewObject,
      CONFIG.editorUrl
    );

    component.uploadImageFromCamera(webInterface);
    await spyOnTakePicture.calls.mostRecent().returnValue;
    await spyOnFromAsset.calls.mostRecent().returnValue;
    tick(500);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(spyOnCropImage).toHaveBeenCalledTimes(1);
  }));


  it('Verify the on call cropImage it should save image', fakeAsync(async () => {
    // tslint:disable-next-line: max-line-length
    const imageSource = ImageSource.fromBase64('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==');

    const spyGetCroppedImage = spyOn(component, 'getCroppedImage').and.returnValue(Promise.resolve({
      toBase64String: () => {
        return '';
      }
    }));

    const webInterface = new webViewInterfaceModule.WebViewInterface(
      webViewObject,
      CONFIG.editorUrl
    );
    const questionService = TestBed.get(QuestionService);
    const spyQuestionService = spyOn(questionService, 'saveQuestionImage').and.returnValue(of({ name: 'image.png' }));

    component.cropImage(imageSource, webInterface);
    // await spyGetCroppedImage.calls.mostRecent().returnValue;
    // expect(spyQuestionService).toHaveBeenCalled();
    flush();
  }));


  it('Verify the on call uploadImageFromGallery it should call cropImage function', fakeAsync(async () => {
    const spyGetCroppedImage = spyOn(component, 'contextSelection').and.returnValue(Promise.resolve([{
      imageAsset: {}
    }]));
    const spyOnFromAsset = spyOn(component, 'fromAsset').and.returnValue(Promise.resolve(true));
    const spyOnCropImage = spyOn(component, 'cropImage').and.returnValue('');

    const webInterface = new webViewInterfaceModule.WebViewInterface(
      webViewObject,
      CONFIG.editorUrl
    );


    component.uploadImageFromGallery(webInterface);
    await spyGetCroppedImage.calls.mostRecent().returnValue;
    await spyOnFromAsset.calls.mostRecent().returnValue;
    tick(500);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(spyOnCropImage).toHaveBeenCalledTimes(1);

  }));


  it('Verify the on call onTakePhoto it should get image from camera', fakeAsync(async () => {
    const spyOpenDialog = spyOn(component, 'openDialog').and.returnValue(Promise.resolve('Camera'));
    const spyUploadImageFromCamera = spyOn(component, 'uploadImageFromCamera').and.returnValue('');
    const webInterface = new webViewInterfaceModule.WebViewInterface(
      webViewObject,
      CONFIG.editorUrl
    );
    component.webInterfaceUploadImage('uploadImage', webInterface);
    await spyOpenDialog.calls.mostRecent().returnValue;
    expect(spyUploadImageFromCamera).toHaveBeenCalledTimes(1);
  }));

  it('Verify the on call onTakePhoto it should get image from gallery', fakeAsync(async () => {
    const spyOpenDialog = spyOn(component, 'openDialog').and.returnValue(Promise.resolve('Gallery'));
    const spyUploadImageFromGallery = spyOn(component, 'uploadImageFromGallery').and.returnValue('');
    const webInterface = new webViewInterfaceModule.WebViewInterface(
      webViewObject,
      CONFIG.editorUrl
    );
    component.webInterfaceUploadImage('uploadImage', webInterface);
    await spyOpenDialog.calls.mostRecent().returnValue;
    expect(spyUploadImageFromGallery).toHaveBeenCalledTimes(1);
  }));

  it(`call to saveQuestion function it should dispatch add question action`, () => {

    spy.and.callFake((action: userActions.AddQuestion) => {
      expect(action.type).toEqual(userActions.UserActionTypes.ADD_QUESTION);
    });
    const question = originalQuestion;
    component.saveQuestion(question);
    expect(mockStore.dispatch).toHaveBeenCalled();

  });

});
