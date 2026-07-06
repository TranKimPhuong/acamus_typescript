import { Page, Locator } from '@playwright/test';
import { BasePage } from '../libs/BasePage';

export class ClassPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // ── Dynamic locators ─────────────────────────────────────────────────────

  /** Row matching both code and name with exact cell values (DevExtreme grid) */
  classRowByCodeAndName(code: string, name: string): Locator {
    return this.page.locator('.dx-data-row')
      .filter({ has: this.page.locator(`td:text-is("${code}")`) })
      .filter({ has: this.page.locator(`td:text-is("${name}"), td b:text-is("${name}")`) })
      .first();
  }

  /** Clickable name link inside the grid row */
  classNameLink(name: string): Locator {
    return this.page.locator('a.link-opacity-100')
      .filter({ has: this.page.getByText(name, { exact: true }) })
      .first();
  }
}
