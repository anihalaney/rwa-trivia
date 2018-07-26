import { browser, element, by, Key } from 'protractor';
export class RealTimeStatsPage {
    // navigateTo() {
    //     return browser.get('/dashboard');
    // }

    getTitle() {
        const titleElement = element(by.css('.clearfix h2'));
        if (titleElement.isPresent) {
            return titleElement.getText();
        }
    }

}
