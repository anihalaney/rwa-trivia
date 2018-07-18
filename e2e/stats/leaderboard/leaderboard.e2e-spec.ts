import { LeaderBoardPage } from './leaderboard.po';
import { browser, element, by, Key } from 'protractor';

describe('NewsLetterPage', () => {

    let page: LeaderBoardPage;
    page = new LeaderBoardPage();

    it('Should display title', () => {
        expect(page.getTitle()).toMatch('Leaderboard');
    });


    it('Should click on View More Button', () => {
        browser.waitForAngularEnabled(false);
        browser.driver.sleep(500);
        page.getViewMoreButton().click();
        browser.driver.sleep(5000);
    });
});
