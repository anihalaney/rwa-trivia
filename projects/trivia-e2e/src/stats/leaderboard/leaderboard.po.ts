import { browser, element, by, Key } from 'protractor';
export class LeaderBoardPage {
    // navigateTo() {
    //     return browser.get('/dashboard');
    // }

    getTitle() {
        const titleElement = element(by.css('.board-title h2'));
        if (titleElement.isPresent) {
            return titleElement.getText();
        }
    }

    getViewMoreButton() {
        const btnElement = element(by.css('.view-all-btn a'));
        if (btnElement.isPresent) {
            return btnElement;
        }
    }
}