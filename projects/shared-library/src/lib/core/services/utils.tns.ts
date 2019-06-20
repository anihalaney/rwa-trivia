import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Feedback, FeedbackType, FeedbackPosition } from 'nativescript-feedback';
import { UtilsCore } from './utilsCore';
import * as firebase from 'nativescript-plugin-firebase';

@Injectable()
export class Utils extends UtilsCore {

  private message: Feedback;
  private messageConfig = {
    position: FeedbackPosition.Bottom,
    duration: 3000,
    type: FeedbackType.Custom,
    message: ''
  };

  constructor(@Inject(PLATFORM_ID) public platformId: Object) {
    super(platformId);
    this.message = new Feedback();
  }

  showMessage(type, message) {
    switch (type) {
      case 'success':
        this.messageConfig.type = FeedbackType.Success;
        break;
      case 'error':
        this.messageConfig.type = FeedbackType.Error;
        break;
    }
    this.messageConfig.message = message;
    this.message.show(this.messageConfig);

  }

  sendErrorToCrashlytics(type: any, error: any) {
    firebase.crashlytics.sendCrashLog(error);
    // firebase.crashlytics.sendCrashLog({
    //   type: type,
    //   exception: error
    // });

  }

}
