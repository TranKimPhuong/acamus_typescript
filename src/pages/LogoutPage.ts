import { Page, Locator } from '@playwright/test';
import { BasePage } from '../libs/BasePage';

export class LogoutPage extends BasePage {
  // Main content
  readonly logoutMessage: Locator;
  readonly pageHeading: Locator;

  // Navigation options after logout
  readonly loginAgainLink: Locator;
  readonly homeLink: Locator;

  constructor(page: Page) {
    super(page);

    this.logoutMessage = page.locator(
      '[class*="logout"], [class*="signed-out"], [class*="sign-out"], ' +
      'p:has-text("logged out"), p:has-text("signed out"), p:has-text("successfully")'
    ).first();

    this.pageHeading = page.locator('h1, h2, h3').first();

    this.loginAgainLink = page.locator(
      'a:has-text("Login"), a:has-text("Sign in"), a:has-text("Log in"), ' +
      'button:has-text("Login"), button:has-text("Sign in")'
    ).first();

    this.homeLink = page.locator('a:has-text("Home"), a[href="/"]').first();
  }
}
