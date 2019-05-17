import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { UtilsCore } from './utilsCore';

@Injectable()
export class Utils extends UtilsCore {

  constructor(
    @Inject(PLATFORM_ID) public platformId: Object) {
      super(platformId);
  }

}
