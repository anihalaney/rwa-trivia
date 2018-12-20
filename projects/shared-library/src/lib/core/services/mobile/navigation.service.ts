import { Injectable } from '@angular/core';
import { RouterExtensions } from "nativescript-angular/router";
import { Router } from '@angular/router';

@Injectable()
export class NavigationService {

  constructor(
    private routerExtensions: RouterExtensions,
    private router: Router
  ) {
  }

  canGoBack() {
    return this.routerExtensions.canGoBack();
  }

  back() {
    console.log(this.router.url);
    if (this.router.url === "/my/invite-friends" ||
    this.router.url === "/my/questions" ||
    this.router.url === "/my/recent-game" ||
    this.router.url === "/game-play" ||
    this.router.url === "/my/profile/tej7Au4YjrM5c5uHx06LT5fIRuF2" ||
    this.router.url === "/stats/leaderboard/Special") {
    this.routerExtensions.navigate(['/dashboard']);
    }
  }
}
