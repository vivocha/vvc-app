import { browser, element, by } from 'protractor';

export class VvcWidgetPage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('vvc-root h1')).getText();
  }
}
