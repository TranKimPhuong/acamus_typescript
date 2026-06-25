import { Page, Locator } from '@playwright/test';
import { BasePage } from '../libs/BasePage';

export class LoginPage extends BasePage {
  // Input fields
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;

  // Buttons
  readonly loginButton: Locator;
  readonly forgotPasswordLink: Locator;

  // Messages / alerts
  readonly errorMessage: Locator;
  readonly validationMessageForUsername: Locator;
  readonly validationMessageForPassword: Locator;

  // Server-side 400 error page
  readonly serverErrorForUsername: Locator;
  readonly serverErrorForPassword: Locator;

  // Logo / header
  readonly logo: Locator;

  constructor(page: Page) {
    super(page);

    this.usernameInput = page.locator('input[name="LoginInput.UserNameOrEmailAddress"]').first();
    this.passwordInput = page.locator('input[name="LoginInput.Password"]').first();
    this.loginButton = page.locator('button[name="Action"]').first();
    this.forgotPasswordLink = page.locator('a:has-text("Forgot"), a:has-text("forgot")');

    this.errorMessage = page.locator('[role="alert"]:has-text("error"), [role="alert"]:has-text("Invalid"), [role="alert"]:has-text("required"), [role="alert"]:has-text("required")').first();
    this.validationMessageForUsername = page.locator('span[id="LoginInput_UserNameOrEmailAddress-error"], span:has-text("The Username or email address field is required.")').first();
    this.validationMessageForPassword = page.locator('span[id="LoginInput_Password-error"], span:has-text("The Password field is required.")').first();

    this.serverErrorForUsername = page.getByText('UserNameOrEmailAddress', { exact: false });
    this.serverErrorForPassword = page.getByText('loginInput.Password', { exact: false });

    this.logo = page.locator('img[alt*="logo"], img[alt*="Logo"], .logo').first();
  }
}
