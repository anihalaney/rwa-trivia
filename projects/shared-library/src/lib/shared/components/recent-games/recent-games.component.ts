import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnDestroy
} from "@angular/core";
import { Store } from "@ngrx/store";
import { CoreState } from "shared-library/core/store";
import { Utils } from "shared-library/core/services";
import { UserActions } from "shared-library/core/store/actions";
import { AutoUnsubscribe } from "ngx-auto-unsubscribe";
import { RecentGames } from "./recent-games";
@Component({
  selector: "recent-games",
  templateUrl: "./recent-games.component.html",
  styleUrls: ["./recent-games.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
@AutoUnsubscribe({ arrayName: "subscriptions" })
export class RecentGamesComponent extends RecentGames implements OnDestroy {
  constructor(
    store: Store<CoreState>,
    utils: Utils,
    cd: ChangeDetectorRef,
    userActions: UserActions
  ) {
    super(store, cd, userActions);
  }

  ngOnDestroy() {}
  
}
