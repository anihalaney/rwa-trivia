import { RealTimeStatsPage } from './realtime-stats.po';
import { browser, element, by, Key } from 'protractor';

describe('RealTimeStatsPage', () => {

    let page: RealTimeStatsPage;
    page = new RealTimeStatsPage();

    it('Should display title', () => {
        browser.waitForAngularEnabled(false);
        expect(page.getTitle()).toMatch('Real-time System Stats');
    });

    it('should checked for 4 stats', () => {
        browser.driver.findElements(by.css('.time-stats')).
            then((elements) => {
                expect(elements.length).toEqual(4);
            }
            );
    });

});
