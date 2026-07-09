import { Page, Locator } from '@playwright/test';
import { BasePage } from '../libs/BasePage';

/** Popup "Create from template gradebook" mở từ icon "+" trong Danh sách sổ điểm mẫu môn học */
export class SubjectGradebookCreateDialogPage extends BasePage {
  readonly saveButton: Locator;
  readonly closeButton: Locator;

  constructor(page: Page) {
    super(page);
    this.saveButton = page.locator('.dx-popup-wrapper dx-button[aria-label="Save"]');
    this.closeButton = page.locator('.dx-popup-wrapper dx-button[aria-label="Close"]');
  }

  /** Dropdown "Subject gradebook templates" */
  templateSelectInput(): Locator {
    return this.page
      .locator('.dx-field-item')
      .filter({ has: this.page.locator('.dx-field-item-label-text', { hasText: 'Subject gradebook templates' }) })
      .locator('input.dx-texteditor-input')
      .first();
  }
}
