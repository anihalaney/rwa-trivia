import { Directive, Input, HostListener } from '@angular/core';
import { Router } from '@angular/router';

@Directive({
  selector: '[stlOpenUserProfile]'
})

export class OpenUserProfileDirective {

  @Input('stlOpenUserProfile') userId: any;

  @HostListener('click', ['$event'])
  @HostListener('tap', ['$event'])
  onClick(event) {
    if (this.userId && this.userId !== '') {
      this.router.navigate([`/user/profile/${this.userId}`]);
    }
  }


  constructor(private router: Router) { }

}

