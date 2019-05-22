import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { RouterExtensions } from 'nativescript-angular/router';
import { pushNotificationRouteConstants } from './../../../../lib/shared/model';

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
    if (this.router.url === '/user/my/invite-friends' ||
      this.router.url === '/user/my/questions' ||
      this.router.url === '/recent-game' ||
      this.router.url === '/privacy-policy' ||
      this.router.url === '/terms-and-conditions' ||
      this.router.url === '/user-feedback' ||
      this.router.url === '/achievements' ||
      this.router.url.includes('game-play') ||
      this.router.url.includes('/user/my/profile/') ||
      this.router.url.includes('/stats/leaderboard/') ) {
      this.routerExtensions.navigate(['/dashboard'], { clearHistory: true });
    } else if (
      this.router.url.includes('/user/profile/') ||
      this.router.url === '/user/my/questions/add' ||
      this.router.url === '/user/my/app-invite-friends-dialog') {
      this.routerExtensions.back();
    }
  }

  redirectPushRoutes(data: any) {
    switch (data.messageType) {
      case pushNotificationRouteConstants.GAME_PLAY:
        this.routerExtensions.navigate(['/dashboard']);
        break;
    }
  }
}
