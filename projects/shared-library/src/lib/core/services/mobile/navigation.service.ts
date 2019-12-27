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
    if (this.router.url === '/dashboard/leaderboard' ||
    this.router.url === '/user/my/invite-friends' ||
    this.router.url === '/privacy-policy' ||
    this.router.url === '/terms-and-conditions' ||
    this.router.url === '/achievements' ||
    this.router.url === '/user-feedback' ||
    this.router.url === '/notification' ||
    this.router.url === '/user/my/questions' ||
    this.router.url.includes('/user/my/questions?backUrl') ||
    this.router.url === '/game-play/play-game-with-random-user' ||
    this.router.url.includes('/user/profile') ||
    (this.router.url.includes('/user/my/profile') && !this.router.url.includes('backUrl') ) ||
    this.router.url.includes('/user/my/game-profile') ||
    this.router.url.includes('/game-play/play-game-with-friend') ||
    this.router.url.includes('/game-play/game-options') ||
    this.router.url === '/recent-games'
    ) {
      this.routerExtensions.navigate(['/dashboard'], { clearHistory: true });
      // this.routerExtensions.back();
    } else if (
      this.router.url === '/privacy-policy' ||
      this.router.url === '/terms-and-conditions' ||
      this.router.url === '/user-feedback' ||
      this.router.url === '/user/my/questions/add' ||
      this.router.url === '/user/my/questions/bulk-upload-request' ||
      this.router.url.includes('/user/game-profile') ||
      this.router.url.includes('app-invite-friends-dialog') ||
      this.router.url.includes('/game-play/challenge') ||
      this.router.url.includes('/update-category-tag') ||
      this.router.url.includes('backUrl')) {
      this.routerExtensions.back();
    }
  }

  redirectPushRoutes(data: any) {
    switch (data.messageType) {
      case pushNotificationRouteConstants.GAME_PLAY:
        this.routerExtensions.navigate(['/dashboard'], { clearHistory: true });
        break;
    }
  }
}
