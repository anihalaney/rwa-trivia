import { Directive, Input, Renderer, Renderer2, HostListener, AfterViewInit, OnDestroy, ElementRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Utils } from './../../core/services';
import { Subscription } from 'rxjs';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { Device, platformNames } from 'tns-core-modules/platform';
import { DEVICE } from 'nativescript-angular/platform-providers';
import { Label } from 'tns-core-modules/ui/label';
import { Button } from 'tns-core-modules/ui/button';
import {
  AnimationPlayer,
  AnimationBuilder,
  AnimationMetadata,
  animate,
  style,
} from '@angular/animations';
import { ɵAnimationEngine as AnimationEngine, } from '@angular/animations/browser';
@Directive({
  selector: '[stlRippleEffect]',
})

@AutoUnsubscribe({ 'arrayName': 'subscriptions' })
export class RippleEffectDirective implements AfterViewInit, OnDestroy {

  controlRef: FormControl;
  hintRef: any;
  lostFocus = false;
  removeClass: string;
  subscriptions = [];
  templateRef: any;
  renderer: Renderer2;
  player: AnimationPlayer;

  @Input() rippleEffect: any;

  @HostListener('tap', ['$event'])
  onTap(event) {
    // if (this.controlRef && this.controlRef.value !== '' && this.lostFocus === false) {
    //   this.lostFocus = true;
    //   // this.displayError();
    // }
    console.log('tap event');
    // this.renderer.setElementStyle(this.templateRef.nativeElement, 'backgroundColor', 'yellow');


    // label.animate({
    //   opacity: .80,
    //   backgroundColor: new Color(newColor1),
    //   duration: 300,
    //   delay: 0,
    //   iterations: 1,
    //   curve: enums.AnimationCurve.easeOut
    // }).then(() => {
    //   label.animate({
    //     opacity: 1,
    //     backgroundColor: new Color(backgrundCol),
    //   });
    // });

    // const startingStyles: any = {
    //   styles: [{}]
    // };

    // const keyframes: any[] = [
    //   {
    //     offset: 0,
    //     styles: {
    //       styles: [{
    //         transform: 'translateX(0px)',
    //       }]
    //     }
    //   },
    //   {
    //     offset: 1,
    //     styles: {
    //       styles: [{
    //         transform: 'translateX(100px)',
    //       }]
    //     }
    //   }];
    // const metadata = this.fadeIn();

    // const factory = this.builder.build(metadata);
    // const player = factory.create(this.templateRef.nativeElement);

    // player.play();

  }

  // , private builder: AnimationBuilder
  constructor(templateRef: ElementRef, renderer: Renderer2) {
    console.log('test called');
    this.renderer = renderer;
    this.templateRef = templateRef;
  }

  ngAfterViewInit() {
  }

  ngOnDestroy() {

  }

}


