import { browser, element, by, Key } from 'protractor';
export class BlogPage {
    navigateTo() {
        return browser.get('/dashboard');
    }
    getTitle() {
        const titleElement = element(by.css('.question-cont h2'));
        if (titleElement.isPresent()) {
            return titleElement.getText();
        }
    }

    getShareButton() {
        const buttonElement = element(by.css('.share'));
        if (buttonElement.isPresent()) {
            return buttonElement;
        }
    }

    getCloseButton() {
        const buttonElement = element(by.css('.close-div'));
        if (buttonElement.isPresent()) {
            return buttonElement;
        }
    }
}