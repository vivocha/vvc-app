import { VvcWidgetPage } from './app.po';

describe('vvc-widget App', () => {
  let page: VvcWidgetPage;

  beforeEach(() => {
    page = new VvcWidgetPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('vvc works!');
  });
});
