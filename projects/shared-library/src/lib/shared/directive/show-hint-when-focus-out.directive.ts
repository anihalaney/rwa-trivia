import { Directive, Input, Renderer2, HostListener, AfterViewInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AutoUnsubscribe } from 'shared-library/shared/decorators';

@Directive({
  selector: '[stlShowHintWhenFocusOut]'
})


@AutoUnsubscribe({'arrayName': 'subscriptions'})
export class ShowHintWhenFocusOutDirective implements AfterViewInit, OnDestroy {

  controlRef: FormControl;
  hintRef: any;
  lostFocus = false;
  removeClass: string;
  subscriptions = [];

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
    this.subscriptions.push(this.controlRef.valueChanges.subscribe(res => {
      if (this.lostFocus) {
        if (this.controlRef.invalid) {
          this.hintRef.style.visibility = 'visible';
          this.hintRef.style.display = 'block';
        } else {
          this.hintRef.style.visibility = 'collapsed';
          this.hintRef.style.display = 'none';
        }
      }
    }));
    this.hintRef = this.stlShowHintWhenFocusOut.hintRef;
    this.hintRef.style.display = 'none';
    this.hintRef.style.visibility = 'collapsed';
    if (this.stlShowHintWhenFocusOut.removeClass) {
      this.removeClass = this.stlShowHintWhenFocusOut.removeClass;
      this.renderer.removeClass(this.hintRef, this.removeClass);
    }
  }

  displayError() {
    if (this.controlRef.invalid) {
      this.hintRef.style.display = 'block';
      this.hintRef.style.visibility = 'visible';
    }
    if (this.stlShowHintWhenFocusOut.removeClass) {
      this.renderer.addClass(this.hintRef, this.removeClass);
    }
  }

  ngOnDestroy() {

  }

}

