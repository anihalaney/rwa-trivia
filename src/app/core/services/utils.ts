import { Injectable }    from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

@Injectable()
export class Utils {

  static regExpEscape = function(s): string {
    return String(s).replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, '\\$1').
        replace(/\x08/g, '\\x08');
  };

  static unsubscribe = function(subs: Subscription[]) {
    subs.forEach(sub => {
      if (sub && sub instanceof Subscription)
        sub.unsubscribe();
    })
  };

  static getRandomInt = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };
}
