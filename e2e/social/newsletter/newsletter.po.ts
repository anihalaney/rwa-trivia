import { browser, element, by, Key } from 'protractor';
export class NewsLetterPage {
    // navigateTo() {
    //     return browser.get('/dashboard');
    // }

    getTitle() {
        const titleElement = element(by.css('.subscrib h2'));
        if (titleElement.isPresent) {
            return titleElement.getText();
        }
    }

    getSubTitle() {
        const subtitleElement = element(by.css('.subscrib p'));
        if (subtitleElement.isPresent) {
            return subtitleElement.getText();
        }
    }

    getEmailElement() {
        return element(by.css('input[formControlName=email]'));
    }

    getSubscribeButton() {
        return element(by.cssContainingText('button', 'Subscribe'));
    }

    getRequiredMessage() {
        const errorElement = element(by.css('.errorSpan'));
        if (errorElement.isPresent) {
            return errorElement.getText();
        }
    }

    getResponseMessage() {
        const responseElement = element(by.css('.message p'));
        if (responseElement.isPresent) {
            return responseElement.getText();
        }
    }
}
