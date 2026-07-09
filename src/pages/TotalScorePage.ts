import { Page, Locator } from '@playwright/test';
import { BasePage } from '../libs/BasePage';

/** Trang "Điểm tổng kết"/"Total scores" (Sổ điểm → Điểm tổng kết) */
export class TotalScorePage extends BasePage {
  readonly classInput: Locator;
  readonly studentRows: Locator;
  readonly notConfiguredWarning: Locator;

  constructor(page: Page) {
    super(page);

    this.classInput = page.locator('dx-select-box input[aria-required="true"]').first();
    this.studentRows = page.locator('nz-table.total-score-gradebook tbody tr.ant-table-row');
    this.notConfiguredWarning = page.locator(
      'span.text-crimson:has-text("chưa được thiết lập"), span.text-crimson:has-text("not available")'
    ).first();
  }

  // ── Dynamic locators ─────────────────────────────────────────────────────

  classDropdownItem(className: string): Locator {
    return this.page
      .locator('.dx-list-item')
      .filter({ hasText: new RegExp(`^${className}`, 'i') })
      .first();
  }
}
