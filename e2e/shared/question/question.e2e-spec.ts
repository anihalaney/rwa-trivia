import { QuestionPage } from './question.po';
import { browser, element, by, Key } from 'protractor';

describe('QuestionPage', () => {
    let page: QuestionPage;

    beforeEach(() => {
        browser.driver.sleep(1000);
        page = new QuestionPage();
    });


    it('Should display title', () => {
        browser.waitForAngularEnabled(false);
        expect(page.getTitle()).toMatch('Question of the day!');
    });
    it('should checked for 3 tags', () => {
        browser.waitForAngularEnabled(false);
        page.getQuestionTags().then((value) => {
            expect(value.split(',').length).toBeGreaterThanOrEqual(3);
        })
    });

    it('Give answer by clicking Answer Button', () => {
        browser.driver.sleep(2000);
        browser.waitForAngularEnabled(false);

        element(by.id('list')).all(by.tagName('li')).get(0).click();
        browser.driver.sleep(1000);
    });
    it('Click on Try Another Button to get next question', () => {
        page.getTryAnotherButton().click();
        browser.driver.sleep(500);
    });
});