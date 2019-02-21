import { Directive, Input, Renderer2, HostListener, AfterViewInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Directive({
  selector: '[stlShowHintWhenFocusOut]'
})
export class ShowHintWhenFocusOutDirective implements AfterViewInit {

  controlRef: FormControl;
  hintRef: any;
  lostFocus = false;
  removeClass: string;

  @Input() stlShowHintWhenFocusOut: any;

  @HostListener('blur', ['$event'])
  onBlur(event) {
      if (this.controlRef && this.controlRef.value !== '' && this.lostFocus === false) {
        this.lostFocus = true;
        this.displayError();
      }
    }

  constructor(private renderer: Renderer2) {}

  ngAfterViewInit() {
    this.controlRef = this.stlShowHintWhenFocusOut.controlRef;
    this.hintRef = this.stlShowHintWhenFocusOut.hintRef;
    this.hintRef.style.display = 'none';
    this.hintRef.style.visibility = 'collapsed';
    if (this.stlShowHintWhenFocusOut.removeClass) {
      this.removeClass = this.stlShowHintWhenFocusOut.removeClass;
      this.renderer.removeClass(this.hintRef, this.removeClass);
    }
  }

  displayError() {
    this.hintRef.style.display = '';
    this.hintRef.style.visibility = '';
    if (this.stlShowHintWhenFocusOut.removeClass) {
      this.renderer.addClass(this.hintRef, this.removeClass);
    }
  }
}

