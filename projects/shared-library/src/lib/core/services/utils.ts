import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { UtilsCore } from './utilsCore';
import { DomSanitizer } from '@angular/platform-browser';
import { MatSnackBar } from '@angular/material';
@Injectable()
export class Utils extends UtilsCore {


  constructor(
    @Inject(PLATFORM_ID) public platformId: Object,
    public sanitizer: DomSanitizer,
    private snackBar: MatSnackBar,
  ) {
    super(platformId, sanitizer);
  }

  showMessage(msg: string) {
    this.snackBar.open(String(msg), '', {
      duration: 2000,
    });
  }



}
