import { QuestionPage } from './question.po';
import { browser, element, by, Key } from 'protractor';

describe('QuestionPage', () => {

    let page: QuestionPage;
    page = new QuestionPage();
    // page.navigateTo();

    it('Should display title', () => {
        browser.waitForAngularEnabled(false);
        expect(page.getTitle()).toMatch('Question of the day!');
    });

    // it('Give answer by clicking Answer Button', () => {
    //     browser.waitForAngularEnabled(false);

    //     element(by.id('list')).all(by.tagName('li')).get(0).click();
    // });
});
