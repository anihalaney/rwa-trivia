import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'social-palette',
  templateUrl: './social-palette.component.html',
  styleUrls: ['./social-palette.component.scss']
})
export class SocialPaletteComponent {
  @Input() blogId: number;
  @Input() isSocial: boolean;
  @Output() notify: EventEmitter<boolean> = new EventEmitter<boolean>();

  closeSocial() {
    this.notify.emit(false);
  }

}
