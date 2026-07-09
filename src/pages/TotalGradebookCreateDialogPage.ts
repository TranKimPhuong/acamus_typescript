import { Page, Locator } from '@playwright/test';
import { BasePage } from '../libs/BasePage';

/** Popup "Create Total gradebook from template" mở từ icon "+" trong Danh sách sổ điểm tổng kết */
export class TotalGradebookCreateDialogPage extends BasePage {
  readonly saveButton: Locator;
  readonly closeButton: Locator;

  constructor(page: Page) {
    super(page);
    this.saveButton = page.locator('.dx-popup-wrapper dx-button[aria-label="Save"]');
    this.closeButton = page.locator('.dx-popup-wrapper dx-button[aria-label="Close"]');
  }

  /** Dropdown "Total gradebook templates" */
  templateSelectInput(): Locator {
    return this.page
      .locator('.dx-field-item')
      .filter({ has: this.page.locator('.dx-field-item-label-text', { hasText: 'Total gradebook templates' }) })
      .locator('input.dx-texteditor-input')
      .first();
  }
}
