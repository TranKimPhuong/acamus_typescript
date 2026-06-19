import { test, expect } from '@playwright/test';
import { LoginActions } from '../src/actions/LoginActions';
import { TopBarActions } from '../src/actions/TopBarActions';
import {
  VALID_USER,
  INVALID_CREDENTIALS,
  EMPTY_CREDENTIALS,
  SPECIAL_CHAR_CREDENTIALS,
} from '../src/data/LoginData';
import { homepageURL, LOGIN_MESSAGES } from '../src/constants/LoginConstants';
import { LogoutActions } from '@actions/LogoutActions';

test.describe('Login Module - https://sis-qc.sis.flexiapp.cloud/', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  // ─── TC_LOGIN_001 ────────────────────────────────────────────────────────────
  test('TC_LOGIN_001 - Login page should display all required elements', async ({ page }) => {
    const loginActions = new LoginActions(page);
    await loginActions.assertLoginPageVisible();
  });

  // ─── TC_LOGIN_002 ────────────────────────────────────────────────────────────
  test('TC_LOGIN_002 - Login successfully with valid credentials then logout', async ({ page }) => {
    const loginActions = new LoginActions(page);
    const topBarActions = new TopBarActions(page);
    const logoutActions = new LogoutActions(page);

    // Step 1: Login
    await loginActions.loginAndWaitForDashboard(VALID_USER.username, VALID_USER.password);

    // Step 2: Assert redirect URL after login
    await loginActions.assertRedirectedAfterLogin(homepageURL);

    // Step 3: Logout
    await topBarActions.logout();

    // Step 4: Assert redirected to logout page
    await logoutActions.assertOnLogoutPage();

    // Step 5: Close browser
    await topBarActions.closeBrowser();
  });

  // ─── TC_LOGIN_003 ────────────────────────────────────────────────────────────
  test('TC_LOGIN_003 - Login fails with wrong username and password', async ({ page }) => {
    const loginActions = new LoginActions(page);
    const creds = INVALID_CREDENTIALS[0];
    await loginActions.login(creds.username, creds.password);
    await loginActions.assertLoginFailed();
  });

  // ─── TC_LOGIN_004 ────────────────────────────────────────────────────────────
  test('TC_LOGIN_004 - Login fails with valid username and wrong password', async ({ page }) => {
    const loginActions = new LoginActions(page);
    const creds = INVALID_CREDENTIALS[1];
    await loginActions.login(creds.username, creds.password);
    await loginActions.assertLoginFailed();
  });

  // ─── TC_LOGIN_005 ────────────────────────────────────────────────────────────
  test('TC_LOGIN_005 - Login fails with wrong username and valid password', async ({ page }) => {
    const loginActions = new LoginActions(page);
    const creds = INVALID_CREDENTIALS[2];
    await loginActions.login(creds.username, creds.password);
    await loginActions.assertLoginFailed();
  });

  // ─── TC_LOGIN_006 ────────────────────────────────────────────────────────────
  test('TC_LOGIN_006 - Login fails when both fields are empty', async ({ page }) => {
    const loginActions = new LoginActions(page);
    await loginActions.openLoginPage();
    await loginActions.clickLoginButton();
    await loginActions.assertBothFieldsValidationError();
  });

  // ─── TC_LOGIN_007 ────────────────────────────────────────────────────────────
  test('TC_LOGIN_007 - Login fails when password field is empty', async ({ page }) => {
    const loginActions = new LoginActions(page);
    const creds = EMPTY_CREDENTIALS[1];
    await loginActions.openLoginPage();
    await loginActions.enterUsername(creds.username);
    await loginActions.clickLoginButton();
    await loginActions.assertPasswordValidationError();
  });

  // ─── TC_LOGIN_008 ────────────────────────────────────────────────────────────
  test('TC_LOGIN_008 - Login fails when username field is empty', async ({ page }) => {
    const loginActions = new LoginActions(page);
    const creds = EMPTY_CREDENTIALS[2];
    await loginActions.openLoginPage();
    await loginActions.enterPassword(creds.password);
    await loginActions.clickLoginButton();
    await loginActions.assertUsernameValidationError();
  });

  // ─── TC_LOGIN_009 ────────────────────────────────────────────────────────────
  test('TC_LOGIN_009 - Password field should mask input', async ({ page }) => {
    const loginActions = new LoginActions(page);
    await loginActions.openLoginPage();
    const passwordInput = page.locator('input[type="password"]').first();
    await expect(passwordInput).toHaveAttribute('type', 'password');
  });

  // ─── TC_LOGIN_010 ────────────────────────────────────────────────────────────
  test('TC_LOGIN_010 - SQL injection attempt should not bypass login', async ({ page }) => {
    const loginActions = new LoginActions(page);
    const creds = SPECIAL_CHAR_CREDENTIALS[0];
    await loginActions.login(creds.username, creds.password);
    await loginActions.assertLoginFailed();
  });

  // ─── TC_LOGIN_011 ────────────────────────────────────────────────────────────
  test('TC_LOGIN_011 - XSS attempt in username should not execute script', async ({ page }) => {
    const loginActions = new LoginActions(page);
    const creds = SPECIAL_CHAR_CREDENTIALS[1];
    await loginActions.login(creds.username, creds.password);
    await loginActions.assertLoginFailed();
  });

});
