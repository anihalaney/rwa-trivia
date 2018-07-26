import { browser, element, by, Key } from 'protractor';
export class QuestionPage {
    navigateTo() {
        return browser.get('/dashboard');
    }
    getTitle() {
        const titleElement = element(by.css('.question-cont h2'));
        if (titleElement.isPresent) {
            return titleElement.getText();
        }
    }

}
