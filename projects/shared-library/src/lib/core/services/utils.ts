import { Injectable, PLATFORM_ID, APP_ID, Inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { CONFIG } from '../../environments/environment'
import { User } from '../../shared/model'
import { isPlatformBrowser, isPlatformServer } from '@angular/common';

@Injectable()
export class Utils {
  private static platforms;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(APP_ID) private appId: string) {
    Utils.platforms = this.platformId;
  }

  static regExpEscape = function (s): string {
    return String(s).replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, '\\$1').
      replace(/\x08/g, '\\x08');
  };

  static unsubscribe = function (subs: Subscription[]) {
    subs.forEach(sub => {
      if (sub && sub instanceof Subscription)
        sub.unsubscribe();
    })
  };

  static getRandomInt = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  static dataURItoBlob(dataURI: any) {
    const binary = atob(dataURI.split(',')[1]);
    const array = [];
    for (let i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)]);
  }

  public getImageUrl(user: User, width: Number, height: Number, size: string) {

    if (user && user.profilePicture && user.profilePicture !== '') {
      return `${CONFIG.functionsUrl}/app/user/profile/${user.userId}/${user.profilePicture}/${width}/${height}`;
    } else {
      if (isPlatformBrowser(Utils.platforms) == false && isPlatformBrowser(Utils.platforms) == false) {
        return `~/assets/images/avatar-${size}.png`;
      } else {
        return `assets/images/avatar-${size}.png`;
      }
    }


  }


  static convertIntoDoubleDigit(digit: Number) {
    return (digit < 10) ? `0${digit}` : digit;
  }

}
