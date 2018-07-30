import { NewsLetterPage } from './newsletter.po';
import { browser, element, by, Key } from 'protractor';

describe('NewsLetterPage', () => {

    let page: NewsLetterPage;
    beforeEach(() => {
        browser.driver.sleep(1000);
        page = new NewsLetterPage();
    });
    // page.navigateTo();

    it('Should display title', () => {
        browser.waitForAngularEnabled(false);
        expect(page.getTitle()).toMatch('Sign up for our newsletter to stay connected');
    });

    it('Should display subtitle', () => {
        browser.waitForAngularEnabled(false);
        expect(page.getSubTitle()).toMatch('Subscribe to our bi-weekly email newsletter for useful tips and valuable resources.');
    });

    it('Should check email validation by clicking Subscribe Button', () => {
        browser.waitForAngularEnabled(false);
        browser.driver.sleep(500);
        page.getSubscribeButton().click();
        expect(page.getRequiredMessage()).toMatch('Email is required!');
        browser.driver.sleep(2000);

        page.getEmailElement().sendKeys('test')
        page.getSubscribeButton().click();
        expect(page.getRequiredMessage()).toMatch('Invalid Email!');
        browser.driver.sleep(2000);

        page.getEmailElement().clear();
        browser.driver.sleep(500);
        page.getEmailElement().sendKeys('test@test.com');
        page.getSubscribeButton().click();
        expect(page.getResponseMessage()).toBeDefined();
        browser.driver.sleep(5000);
    });
});
