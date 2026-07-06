import { Page, Locator } from '@playwright/test';
import { BasePage } from '../libs/BasePage';

export class LogoutPage extends BasePage {
  // Main content
  readonly pageHeading: Locator;

  constructor(page: Page) {
    super(page);

    this.pageHeading = page.locator('h1, h2, h3').first();
  }
}
