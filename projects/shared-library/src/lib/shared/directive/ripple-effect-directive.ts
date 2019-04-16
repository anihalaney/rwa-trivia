import { Directive, Input, Renderer2, HostListener, OnDestroy, ElementRef, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { Color } from 'tns-core-modules/color';
import * as enums from 'tns-core-modules/ui/enums';
@Directive({
  selector: '[stlRippleEffect]',
})

@AutoUnsubscribe({ 'arrayName': 'subscriptions' })
export class RippleEffectDirective implements OnDestroy {


  @Input() stlBackgroundColor: string;
  @Input() stlOpacity: number;
  @Input() stlBackgroundColorAfter: string;

  templateRef: any;
  renderer: Renderer2;
  defaultColor: '#F8F8F8';

  @Input() rippleEffect: any;
  @Output() rippleTap = new EventEmitter<string>();

  @HostListener('tap', ['$event'])
  onTap(event) {
    if (!this.stlOpacity) {
      this.stlOpacity = 0.50;
    } else {
      this.stlOpacity = Number(this.stlOpacity);
    }

    if (this.stlBackgroundColor === undefined) {
      if (String(this.templateRef.nativeElement.backgroundColor) &&
        String(this.templateRef.nativeElement.backgroundColor) !== 'undefined') {
        this.stlBackgroundColor = String(this.templateRef.nativeElement.backgroundColor);
      } else {
        this.stlBackgroundColor = '#F8F8F8';
      }
    }

    if (!this.stlOpacity) {
      this.stlOpacity = this.stlOpacity;
    }

    this.templateRef.nativeElement.animate({
      opacity: this.stlOpacity,
      backgroundColor: new Color(this.stlBackgroundColor),
      duration: 200,
      delay: 0,
      iterations: 1,
      curve: enums.AnimationCurve.easeOut
    }).then(() => {
      if (this.stlBackgroundColor === '#F8F8F8') {
        this.templateRef.nativeElement.style.backgroundColor = '';
      } else {

        if (this.stlBackgroundColorAfter || this.stlBackgroundColorAfter === '') {
          this.templateRef.nativeElement.style.backgroundColor = this.stlBackgroundColorAfter;
        } else {
          this.templateRef.nativeElement.style.backgroundColor = this.stlBackgroundColor;
        }
      }
      this.templateRef.nativeElement.style.opacity = 1;
      this.rippleTap.emit();
    });
  }

  constructor(templateRef: ElementRef, renderer: Renderer2) {
    this.renderer = renderer;
    this.templateRef = templateRef;

  }

  ngOnDestroy() {

  }
}


