import { Page, Locator } from '@playwright/test';
import { BasePage } from '../libs/BasePage';

export class NavigationMenuPage extends BasePage {
  // Menu chính "Sổ điểm"
  readonly gradingBookMenu: Locator;

  // Menu con "Cơ chế chấm điểm"
  readonly gradingMechanismSubMenu: Locator;

  // Mục "Sổ điểm mẫu"
  readonly gradingBookTemplateItem: Locator;

  constructor(page: Page) {
    super(page);

    this.gradingBookMenu = page.locator(
      'span:has-text("Sổ điểm"), a:has-text("Gradebook")'
    ).first();

    this.gradingMechanismSubMenu = page.locator(
      'span:has-text("Gradebook management"), span:has-text("Cơ chế chấm điểm")'
    ).first();

    this.gradingBookTemplateItem = page.locator(
      'span:has-text("Subject gradebook templates"), span:has-text("Sổ điểm mẫu")'
    ).first();
  }
}
