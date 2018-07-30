import { browser, element, by, Key } from 'protractor';
export class QuestionPage {
    navigateTo() {
        return browser.get('/dashboard');
    }
    getTitle() {
        const titleElement = element(by.css('.question-cont h2'));
        if (titleElement.isPresent()) {
            return titleElement.getText();
        }
    }
    getQuestionTags() {
        const tagElement = element(by.css('.question-tags span'));
        if (tagElement.isPresent()) {
            return tagElement.getText();
        }

    }
    getTryAnotherButton() {
        const buttonElement = element(by.cssContainingText('a', 'Try Another'));
        if (buttonElement.isPresent()) {
            return buttonElement;
        }

    }

}