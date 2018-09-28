import { Component, ViewChild, OnInit, AfterViewInit, ChangeDetectorRef } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { AppState, appState } from './../../../../store'
import { Store, select } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { User, Question } from 'shared-library/shared/model';
import { RadSideDrawerComponent, SideDrawerType } from "nativescript-ui-sidedrawer/angular";
import { RadSideDrawer } from 'nativescript-ui-sidedrawer';

@Component({
    moduleId: module.id,
    selector: "ns-home",
    templateUrl: "home.component.html",
    styleUrls: ["home.component.css"]
})
export class HomeComponent implements AfterViewInit, OnInit {

    user: User;
    showNewsCard = true;
    private _mainContentText: string;
    questionOfTheDay$: Observable<Question>;
    subs: Subscription[] = [];

    userDict$: Observable<{ [key: string]: User }>;

    constructor(private _changeDetectionRef: ChangeDetectorRef,
        private store: Store<AppState>) {
    }

    // @ViewChild(RadSideDrawerComponent) public drawerComponent: RadSideDrawerComponent;
    @ViewChild('drawerComponent') public drawerComponent: RadSideDrawerComponent;
    private drawer: RadSideDrawer;



    ngAfterViewInit() {
        this.drawer = this.drawerComponent.sideDrawer;
        this._changeDetectionRef.detectChanges();
    }

    ngOnInit() {

        this.questionOfTheDay$ = this.store.select(appState.coreState).pipe(select(s => s.questionOfTheDay));
        
        this.userDict$ = this.store.select(appState.coreState).pipe(select(s => s.userDict));

        // this.questionOfTheDay$.subscribe(data => {
        //     console.log('data');
        //     console.log(data);
        // })

        this.userDict$.subscribe(data => {
            console.log('user');
            console.log(data);
        })

        this.subs.push(this.store.select(appState.coreState).pipe(select(s => s.user)).subscribe(user => {
            this.user = user;
            console.log('user called', this.user);
            if (user) {
              this.user = user;
              if (this.user.isSubscribed) {
                this.showNewsCard = false;
              }
              // Load active Games
            //   this.store.dispatch(this.gameActions.getActiveGames(user));
            //   this.store.dispatch(new gameplayactions.LoadGameInvites(user.userId));
      
            } else {
              this.showNewsCard = true;
            }
          }));
      

    }

    get mainContentText() {
        return this._mainContentText;
    }

    set mainContentText(value: string) {
        this._mainContentText = value;
    }

    public openDrawer() {
        this.drawer.showDrawer();
    }

    public onCloseDrawerTap() {
        this.drawer.closeDrawer();
    }

}
