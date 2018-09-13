import { TestBed, ComponentFixture, async, fakeAsync } from '@angular/core/testing';
import { LeaderboardComponent } from './leaderboard.component';
import { StoreModule, Store } from '@ngrx/store';
import * as leaderBoardActions from '../../store/actions';
import { TEST_DATA } from '../../../testing/test.data';
import { Category, User, LeaderBoardUser } from '../../../../../../shared-library/src/lib/shared/model';
import { UserActions } from '../../../../../../shared-library/src/lib/core/store/actions';


describe('Component: LeaderboardComponent', () => {

    let component: LeaderboardComponent;
    let fixture: ComponentFixture<LeaderboardComponent>;

    beforeEach(() => {
        // refine the test module by declaring the LeaderboardComponent component
        TestBed.configureTestingModule({
            imports: [StoreModule.forRoot({})],
            providers: [Store, UserActions],
            declarations: [LeaderboardComponent]
        });

        // create component and LeaderboardComponent fixture
        fixture = TestBed.createComponent(LeaderboardComponent);

        // get LeaderboardComponent component from the fixture
        component = fixture.componentInstance;


    });

    it('check length of record', () => {
        component.leaderBoardStatDict = TEST_DATA.leaderBoard;
        console.log(JSON.stringify(component.leaderBoardStatDict));

        let length = component.leaderBoardStatDict['1'].slice(0, 3).length;
        expect(length).toEqual(3);
        expect(length).toBeTruthy();

        length = component.leaderBoardStatDict['2'].slice(0, 3).length;
        expect(length).toEqual(3);
        expect(length).toBeTruthy();

        length = component.leaderBoardStatDict['3'].slice(0, 3).length;
        expect(length).toEqual(3);
        expect(length).toBeTruthy();
    });

    it('click on view more button', () => {
        component.leaderBoardStatDict = TEST_DATA.leaderBoard;

        let length = component.leaderBoardStatDict['1'].length;
        expect(length).toEqual(10);
        expect(length).toBeTruthy();

        length = component.leaderBoardStatDict['2'].length;
        expect(length).toEqual(10);
        expect(length).toBeTruthy();

        length = component.leaderBoardStatDict['3'].length;
        expect(length).toEqual(10);
        expect(length).toBeTruthy();

    });
});