import { BlogPage } from './blog.po';
import { browser, element, by, Key } from 'protractor';

describe('BlogPage', () => {

    let page: BlogPage;

    // page.navigateTo();
    beforeEach(() => {
        browser.driver.sleep(500);
        page = new BlogPage();
    });

    it('should checked for 3  category', () => {
        browser.driver.sleep(2000);
        browser.waitForAngularEnabled(false);
        browser.driver.findElements(by.css('.info .card')).
            then((elements) => {
                expect(elements.length).toEqual(3);
            }
            );
    });

    it('Click on Share Button', () => {
        browser.waitForAngularEnabled(false);
        page.getShareButton().click();
        browser.driver.sleep(500);
    });

    // it('Should click on Fb button to share blog', () => {
    //     browser.driver.sleep(500);
    //     browser.waitForAngularEnabled(false);
    //     element(by.css('.btn-spacing')).all(by.tagName('share-button')).get(0).click();
    //     browser.driver.sleep(5000);
    // });
    it('Click on Close Button to hide social share option', () => {
        browser.waitForAngularEnabled(false);
        browser.driver.sleep(500);
        page.getCloseButton().click();
    });
});