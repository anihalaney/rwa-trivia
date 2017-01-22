import { TriviaPage } from './app.po';

describe('trivia App', function() {
  let page: TriviaPage;

  beforeEach(() => {
    page = new TriviaPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
