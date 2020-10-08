import { Directive, Input, Renderer2, HostListener, OnDestroy, ElementRef, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AutoUnsubscribe } from 'shared-library/shared/decorators';
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
  @Input() tapWithoutAnimate: boolean;
  @Input() animationDuration: number;
  templateRef: any;
  renderer: Renderer2;
  defaultColor: '#F8F8F8';

  @Input() rippleEffect: any;
  @Output() rippleTap = new EventEmitter<string>();

  @HostListener('tap', ['$event'])
  async onTap(event) {
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

    try {
      if (this.tapWithoutAnimate) {
        this.rippleTap.emit();
      }
      await this.templateRef.nativeElement.animate({
        opacity: this.stlOpacity,
        backgroundColor: new Color(this.stlBackgroundColor),
        duration: this.animationDuration ? Number(this.animationDuration) : 200,
        delay: 0,
        iterations: 1,
        curve: enums.AnimationCurve.easeOut
      });

      let color;
      if (this.stlBackgroundColor === '#F8F8F8') {
        color = new Color(0.62, 0, 0, 0);
      } else {
        if (this.stlBackgroundColorAfter || this.stlBackgroundColorAfter === 'transparent') {
          color = new Color(this.stlBackgroundColorAfter);
        } else {
          color = new Color(this.stlBackgroundColor);
        }
      }

       await this.templateRef.nativeElement.animate({
        backgroundColor: color,
        opacity: 1,
        delay: 0
      });

      if (!this.tapWithoutAnimate) {
        this.rippleTap.emit();
      }
    } catch (e) {
      console.log('ERROR', e);
    }


  }

  constructor(templateRef: ElementRef, renderer: Renderer2) {
    this.renderer = renderer;
    this.templateRef = templateRef;

  }

  ngOnDestroy() {

  }
}


