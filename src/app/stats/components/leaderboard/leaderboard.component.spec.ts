import { TestBed, ComponentFixture, async, fakeAsync } from '@angular/core/testing';
import { LeaderboardComponent } from './leaderboard.component';
import { StoreModule, Store } from '@ngrx/store';
import * as leaderBoardActions from '../../store/actions';
import { TEST_DATA } from '../../../testing/test.data';
import { Category, User, LeaderBoardUser } from '../../../model';
import { UserActions } from '../../../core/store/actions';


describe('Component: LeaderboardComponent', () => {

    let component: LeaderboardComponent;
    let fixture: ComponentFixture<LeaderboardComponent>;
    let dict: { [key: string]: Array<LeaderBoardUser> };

    beforeEach(() => {
        // refine the test module by declaring the NewsletterComponent component
        TestBed.configureTestingModule({
            imports: [StoreModule.forRoot({})],
            providers: [Store, UserActions],
            declarations: [LeaderboardComponent]
        });

        // create component and NewsletterComponent fixture
        fixture = TestBed.createComponent(LeaderboardComponent);

        // get NewsletterComponent component from the fixture
        component = fixture.componentInstance;


    });

    it('check length of record', () => {
        component.leaderBoardStatDict = TEST_DATA.leaderBoard;
        console.log(JSON.stringify(component.leaderBoardStatDict));

        let length = component.leaderBoardStatDict['1'].length;
        expect(length).toEqual(3);
        expect(length).toBeTruthy();

        length = component.leaderBoardStatDict['2'].length;
        expect(length).toEqual(3);
        expect(length).toBeTruthy();

        length = component.leaderBoardStatDict['3'].length;
        expect(length).toEqual(3);
        expect(length).toBeTruthy();
    });
    // it('click on view more button', () => {
    //     component.leaderBoardCat = ['1', '2', '3'];
    //     const length = component.leaderBoardCat.length;
    //     expect(length).toEqual(3);
    //     expect(length).toBeTruthy();
    // });
});
