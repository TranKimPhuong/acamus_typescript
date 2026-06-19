import { Page, Locator } from '@playwright/test';
import { BasePage } from '../libs/BasePage';

export class NavigationMenuPage extends BasePage {
  // Menu chính "Sổ điểm"
  readonly gradingBookMenu: Locator;

  // Menu con "Cơ chế chấm điểm"
  readonly gradingMechanismSubMenu: Locator;

  // Mục "DS Sổ điểm mẫu môn học"
  readonly gradingBookTemplateItem: Locator;

  // Menu chính "School management" (parent của Classes)
  readonly schoolManagementMenu: Locator;

  // Menu chính "Lớp học"
  readonly classMenu: Locator;

  // Mục "Danh sách lớp học"
  readonly classListItem: Locator;

  // Mục "Điểm nhận xét môn học"
  readonly subjectScoreGradebookItem: Locator;

  constructor(page: Page) {
    super(page);

    this.gradingBookMenu = page.locator(
      'a:has(span:has-text("Sổ điểm")), a:has(span:has-text("Gradebook"))'
    ).first();

    this.gradingMechanismSubMenu = page.locator(
      'a:has(span:has-text("Cơ chế chấm điểm")), a:has(span:has-text("Gradebook management"))'
    ).first();

    this.gradingBookTemplateItem = page.locator(
      'a:has(span:has-text("DS Sổ điểm mẫu môn học")), a:has(span:has-text("Subject gradebook templates")), a:has(span:has-text("Sổ điểm mẫu"))'
    ).first();

    this.schoolManagementMenu = page.locator(
      'a:has(span:has-text("Quản lý trường")), a:has(span:has-text("School management"))'
    ).first();

    this.classMenu = page.locator(
      'a:has(span:has-text("Lớp học")), a:has(span:has-text("Classes"))'
    ).first();

    this.classListItem = page.locator(
      'a:has(span:has-text("Danh sách lớp học")), a:has(span:has-text("Class list"))'
    ).first();

    this.subjectScoreGradebookItem = page.locator(
      'a:has(span:has-text("Điểm nhận xét môn học")), a:has(span:has-text("Subject score gradebook"))'
    ).first();
  }
}
