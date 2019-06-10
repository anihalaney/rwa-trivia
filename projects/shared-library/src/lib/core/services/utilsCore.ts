import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';
import { Subscription } from 'rxjs';
import { CONFIG } from '../../environments/environment';
import { Answer, User } from '../../shared/model';

export class UtilsCore {

  constructor(
    @Inject(PLATFORM_ID) public platformId: Object) {
  }

  regExpEscape(s: string) {
    return String(s).replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, '\\$1').
      replace(/\x08/g, '\\x08');
  }

  unsubscribe(subs: Subscription[]) {
    subs.forEach(sub => {
      if (sub && sub instanceof Subscription) {
        sub.unsubscribe();
      }
    });
  }

  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  dataURItoBlob(dataURI: any) {
    const binary = atob(dataURI.split(',')[1]);
    const array = [];
    for (let i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)]);
  }

  getImageUrl(user: User, width: Number, height: Number, size: string) {
    if (user && user.profilePicture && user.profilePicture !== '') {
      return `${CONFIG.functionsUrl}/user/profile/${user.userId}/${user.profilePicture}/${width}/${height}`;
    } else {
      if (isPlatformBrowser(this.platformId) === false && isPlatformServer(this.platformId) === false) {
        return `~/assets/images/avatar-${size}.png`;
      } else {
        return `assets/images/avatar-${size}.png`;
      }
    }
  }

  getQuestionUrl(image) {
    return `${CONFIG.functionsUrl}/question/getQuestionImage/${image}`;
  }

  convertIntoDoubleDigit(digit: Number) {
    return (digit < 10) ? `0${digit}` : `${digit}`;
  }

  changeAnswerOrder(answers: Answer[]) {
    if (answers) {
      for (let i = answers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = answers[i];
        answers[i] = answers[j];
        answers[j] = temp;
      }
    }
    return answers;
  }

  getTimeDifference(pastTime: number, currentTime?: number): number {
    if (!currentTime) {
      const utcDate = new Date(new Date().toUTCString());
      currentTime = utcDate.getTime();
    }
    const diff = currentTime - pastTime;
    return diff;
  }

  public getUTCTimeStamp() {
    const date = new Date(new Date().toUTCString());
    const millis = date.getTime();
    return millis;
  }

  public convertMilliSIntoMinutes(millis) {
    return millis / 60000;
  }

}
