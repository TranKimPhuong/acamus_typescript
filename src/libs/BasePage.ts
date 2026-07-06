import { Page, Locator, expect } from '@playwright/test';

export class BasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigate(url: string): Promise<void> {
    await this.page.goto(url);
  }

  async getTitle(): Promise<string> {
    return this.page.title();
  }

  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  async waitForElement(locator: Locator, timeout?: number): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout });
  }

  async isVisible(locator: Locator): Promise<boolean> {
    return locator.isVisible();
  }

  async getText(locator: Locator): Promise<string> {
    return (await locator.textContent()) ?? '';
  }

  async typeText(locator: Locator, text: string): Promise<void> {
    await locator.fill(text);
  }

  async clickElement(locator: Locator): Promise<void> {
    await locator.click();
  }

  async clearAndType(locator: Locator, text: string): Promise<void> {
    await locator.clear();
    await locator.fill(text);
  }

  async assertVisible(locator: Locator, timeout?: number): Promise<void> {
    await expect(locator).toBeVisible({ timeout });
  }

  async assertText(locator: Locator, expected: string): Promise<void> {
    await expect(locator).toHaveText(expected);
  }

  async assertUrl(expected: string): Promise<void> {
    await expect(this.page).toHaveURL(expected);
  }

  async takeScreenshot(name: string): Promise<void> {
    await this.page.screenshot({ path: `reports/screenshots/${name}.png`, fullPage: true });
  }
}
