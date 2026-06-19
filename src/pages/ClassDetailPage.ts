import { Page, Locator } from '@playwright/test';
import { BasePage } from '../libs/BasePage';

export class ClassDetailPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  /** All student rows on the class detail page (excludes freespace/header rows) */
  get studentRows(): Locator {
    return this.page.locator('tbody tr.dx-data-row');
  }
}
