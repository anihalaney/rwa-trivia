import { LeaderBoardPage } from './leaderboard.po';
import { browser, element, by, Key } from 'protractor';

describe('LeaderBoardPage', () => {

    let page: LeaderBoardPage;
    beforeEach(() => {
        browser.driver.sleep(1000);
        page = new LeaderBoardPage();
    });

    it('Should display title', () => {
        browser.waitForAngularEnabled(false);
        expect(page.getTitle()).toMatch('Leaderboard');
    });

    it('should checked for 3  category', () => {
        browser.driver.findElements(by.css('.div-count .categorybox')).
            then((elements) => {
                expect(elements.length).toEqual(3);
            }
            );
    });


    it('Should click on View More Button', () => {
        browser.waitForAngularEnabled(false);
        browser.driver.sleep(500);
        page.getViewMoreButton().click();
        browser.driver.sleep(2000);
    });
});