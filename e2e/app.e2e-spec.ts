import { RwaPage } from './app.po';

describe('rwa App', function() {
  let page: RwaPage;

  beforeEach(() => {
    page = new RwaPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
