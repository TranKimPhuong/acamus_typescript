import { Page, Locator } from '@playwright/test';
import { BasePage } from '../libs/BasePage';

export class LoginPage extends BasePage {
  // Form container
  readonly loginForm: Locator;

  // Input fields
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;

  // Buttons
  readonly loginButton: Locator;
  readonly forgotPasswordLink: Locator;

  // Messages / alerts
  readonly errorMessage: Locator;
  readonly successMessage: Locator;
  readonly validationMessageForUsername: Locator;
  readonly validationMessageForPassword: Locator;

  // Server-side 400 error page
  readonly serverErrorHeading: Locator;
  readonly serverErrorForUsername: Locator;
  readonly serverErrorForPassword: Locator;

  // Loading indicator
  readonly loadingSpinner: Locator;

  // Logo / header
  readonly logo: Locator;
  readonly pageTitle: Locator;

  constructor(page: Page) {
    super(page);

    this.loginForm = page.locator('form');
    this.usernameInput = page.locator('input[name="LoginInput_UserNameOrEmailAddress"], input[id="LoginInput_UserNameOrEmailAddress"], input[placeholder*="sername"]').first();
    this.passwordInput = page.locator('input[name="LoginInput_Password"], input[id="LoginInput_Password"], input[placeholder*="assword"]').first();
    this.loginButton = page.locator('button[type="submit"], button[name="Action"], button:has-text("Login"), button:has-text("Sign in")').first();
    this.forgotPasswordLink = page.locator('a:has-text("Forgot"), a:has-text("forgot")');

    this.errorMessage = page.locator('[role="alert"]:has-text("error"), [role="alert"]:has-text("Invalid"), [role="alert"]:has-text("required"), [role="alert"]:has-text("required")').first();
    this.successMessage = page.locator('[class*="success"], .alert-success').first();
    this.validationMessageForUsername = page.locator('span[id="LoginInput_UserNameOrEmailAddress-error"], span:has-text("The Username or email address field is required.")').first();
    this.validationMessageForPassword = page.locator('span[id="LoginInput_Password-error"], span:has-text("The Password field is required.")').first();

    this.serverErrorHeading = page.getByText('[400]', { exact: false });
    this.serverErrorForUsername = page.getByText('UserNameOrEmailAddress', { exact: false });
    this.serverErrorForPassword = page.getByText('loginInput.Password', { exact: false });

    this.loadingSpinner = page.locator('[class*="spinner"], [class*="loading"], .loader').first();

    this.logo = page.locator('img[alt*="logo"], img[alt*="Logo"], .logo').first();
    this.pageTitle = page.locator('h1, h2, .page-title, .login-title').first();
  }
}
