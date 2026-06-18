import { Page, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { Logger } from '../libs/Logger';
import { LOGIN_URL, LOGIN_MESSAGES, TIMEOUTS } from '../constants/LoginConstants';

export class LoginActions {
  private page: Page;
  private loginPage: LoginPage;
  private logger: Logger;

  constructor(page: Page) {
    this.page = page;
    this.loginPage = new LoginPage(page);
    this.logger = new Logger('LoginActions');
  }

  async openLoginPage(): Promise<void> {
    this.logger.step('Navigate to login page');
    await this.loginPage.navigate(LOGIN_URL);
    await this.loginPage.waitForPageLoad();
    await this.loginPage.waitForElement(this.loginPage.usernameInput, TIMEOUTS.MEDIUM);
  }

  async enterUsername(username: string): Promise<void> {
    this.logger.step(`Enter username: ${username}`);
    await this.loginPage.clearAndType(this.loginPage.usernameInput, username);
  }

  async enterPassword(password: string): Promise<void> {
    this.logger.step('Enter password: ****');
    await this.loginPage.clearAndType(this.loginPage.passwordInput, password);
  }

  async clickLoginButton(): Promise<void> {
    this.logger.step('Click login button');
    await this.loginPage.clickElement(this.loginPage.loginButton);
  }

  async login(username: string, password: string): Promise<void> {
    this.logger.step(`Login with user: ${username}`);
    await this.openLoginPage();
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLoginButton();
  }

  async loginAndWaitForDashboard(username: string, password: string): Promise<void> {
    await this.login(username, password);
    this.logger.step('Wait for dashboard to load after login');
    await this.loginPage.waitForPageLoad();
  }

  async getErrorMessage(): Promise<string> {
    await this.loginPage.waitForElement(this.loginPage.errorMessage, TIMEOUTS.SHORT);
    return this.loginPage.getText(this.loginPage.errorMessage);
  }

  async assertErrorMessage(expected: string): Promise<void> {
    this.logger.step(`Assert error message contains: "${expected}"`);
    const message = await this.getErrorMessage();
    expect(message).toContain(expected);
  }

  async assertLoginPageVisible(): Promise<void> {
    this.logger.step('Assert login page is visible');
    await this.loginPage.assertVisible(this.loginPage.usernameInput);
    await this.loginPage.assertVisible(this.loginPage.passwordInput);
    await this.loginPage.assertVisible(this.loginPage.loginButton);
  }

  async assertLoginFailed(): Promise<void> {
    this.logger.step('Assert login failed (error alert visible)');
    await this.loginPage.assertVisible(this.loginPage.errorMessage);
  }

  async assertUsernameValidationError(): Promise<void> {
    this.logger.step('Assert username required error (client span OR server 400)');
    // client-side span OR server-side 400 list item — whichever appears first
    const usernameError = this.loginPage.validationMessageForUsername
      .or(this.loginPage.serverErrorForUsername);
    await expect(usernameError).toBeVisible({ timeout: TIMEOUTS.SHORT });
  }

  async assertPasswordValidationError(): Promise<void> {
    this.logger.step('Assert password required error (client span OR server 400)');
    const passwordError = this.loginPage.validationMessageForPassword
      .or(this.loginPage.serverErrorForPassword);
    await expect(passwordError).toBeVisible({ timeout: TIMEOUTS.SHORT });
  }

  // Playwright .or() = locator A HOẶC locator B
  // Test PASS khi bất kỳ một trong hai visible
  async assertBothFieldsValidationError(): Promise<void> {
    this.logger.step('Assert both fields required error (client span OR server 400)');
    const usernameError = this.loginPage.validationMessageForUsername // span client-side
      .or(this.loginPage.serverErrorForUsername);                     // li server 400
    const passwordError = this.loginPage.validationMessageForPassword
      .or(this.loginPage.serverErrorForPassword);
    await expect(usernameError).toBeVisible({ timeout: TIMEOUTS.SHORT });
    await expect(passwordError).toBeVisible({ timeout: TIMEOUTS.SHORT });
  }

  async assertRedirectedAfterLogin(expectedUrl: string): Promise<void> {
    this.logger.step(`Assert URL is: "${expectedUrl}"`);
    await expect(this.page).toHaveURL(expectedUrl, { timeout: TIMEOUTS.LONG });
  }

  async clickForgotPassword(): Promise<void> {
    this.logger.step('Click Forgot Password link');
    await this.loginPage.clickElement(this.loginPage.forgotPasswordLink);
  }

  async isLoginButtonEnabled(): Promise<boolean> {
    return this.loginPage.loginButton.isEnabled();
  }
}
