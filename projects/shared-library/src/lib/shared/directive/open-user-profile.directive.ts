import { Directive, Input, HostListener } from '@angular/core';
import { Router } from '@angular/router';

@Directive({
  selector: '[stlOpenUserProfile]'
})

export class OpenUserProfileDirective {

  @Input() stlOpenUserProfile: any;

  @HostListener('click', ['$event'])
  @HostListener('tap', ['$event'])
  onClick(event) {
    this.router.navigate([`/user/profile/${this.stlOpenUserProfile}`]);
  }


  constructor(private router: Router) { }

}

