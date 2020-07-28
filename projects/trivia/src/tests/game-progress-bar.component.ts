import 'reflect-metadata';
import { GameProgressBarComponent } from 'shared-library/shared/mobile/component/game-progress-bar/game-progress-bar.component';
import { nsTestBedBeforeEach, nsTestBedAfterEach, nsTestBedRender } from 'nativescript-angular/testing';
import { ComponentFixture } from '@angular/core/testing';
describe('GameProgressBarComponent', async () => {

    let component: GameProgressBarComponent;
    let fixture: ComponentFixture<GameProgressBarComponent>;

    afterAll(() => { });
    beforeEach(nsTestBedBeforeEach([GameProgressBarComponent], [
    ],
        []
    ));
    afterEach(nsTestBedAfterEach());


    beforeEach((async () => {
        fixture = await nsTestBedRender(GameProgressBarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should create', () => {
        component.totalRound = 8;
        component.questionRound = 2;
        component.ngOnInit();
        expect(component.gameProgress).toBe('2*,6*');
    });
});
