import { Injectable, ComponentFactoryResolver } from '@angular/core';
import { RouterExtensions } from 'nativescript-angular/router';
import { Router } from '@angular/router';
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
    if (this.router.url === '/my/invite-friends' ||
      this.router.url === '/my/questions' ||
      this.router.url === '/login' ||
      this.router.url === '/my/recent-game' ||
      this.router.url.includes('game-play') ||
      this.router.url.includes('/my/profile/') ||
      this.router.url.includes('/stats/leaderboard/')) {
      this.routerExtensions.navigate(['/dashboard'], { clearHistory: true });
    } else if (
      this.router.url === '/my/questions/add' ||
      this.router.url === '/my/app-invite-friends-dialog') {
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
