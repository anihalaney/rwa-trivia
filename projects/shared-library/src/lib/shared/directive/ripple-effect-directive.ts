import { Directive, Input, Renderer2, HostListener, OnDestroy, ElementRef } from '@angular/core';
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

  templateRef: any;
  renderer: Renderer2;
  defaultColor: '#ff00ff';

  @Input() rippleEffect: any;

  @HostListener('tap', ['$event'])
  onTap(event){
    console.log('tap event');
    const originalColor = String(this.templateRef.nativeElement.backgroundColor);
    // console.log('original collor', originalColor);
    if (!this.stlOpacity) {
      this.stlOpacity = 0.50;
    } else {
      this.stlOpacity = Number(this.stlOpacity);
    }

    if (!this.stlBackgroundColor) {
      this.stlBackgroundColor = (this.templateRef.nativeElement.backgroundColor);
      console.log('in line 32', this.stlBackgroundColor);
      if (!this.stlBackgroundColor) {
        this.stlBackgroundColor = '#fdfdfd';
        this.stlOpacity = 0.20;
      } else {
        this.stlBackgroundColor = String(this.stlBackgroundColor);
      }
    } else {
      console.log('background color', this.stlBackgroundColor);
    }
    console.log('background color fianl  45', this.stlBackgroundColor);
    console.log('background stlOpacity', this.stlOpacity);
    this.templateRef.nativeElement.animate({
      opacity: this.stlOpacity,
      backgroundColor: new Color(this.stlBackgroundColor),
      duration: 350,
      delay: 0,
      iterations: 1,
      curve: enums.AnimationCurve.easeOut
    }).then(() => {
      this.templateRef.nativeElement.style.backgroundColor = originalColor;
      // this.templateRef.nativeElement.style
      this.templateRef.nativeElement.style.opacity = 1;

    });
  }

  constructor(templateRef: ElementRef, renderer: Renderer2) {
    this.renderer = renderer;
    this.templateRef = templateRef;

  }

  ngOnDestroy() {

  }
}


