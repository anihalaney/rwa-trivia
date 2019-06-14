import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { UtilsCore } from './utilsCore';
import { DomSanitizer } from '@angular/platform-browser';
@Injectable()
export class Utils extends UtilsCore {


  constructor(
    @Inject(PLATFORM_ID) public platformId: Object,
    public sanitizer: DomSanitizer
    ) {
    super(platformId, sanitizer);
  }


}
