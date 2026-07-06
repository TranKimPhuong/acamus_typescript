import { Page, Locator } from '@playwright/test';
import { BasePage } from '../libs/BasePage';

export class NavigationMenuPage extends BasePage {
  // Menu chính "Sổ điểm"
  readonly gradebookMenu: Locator;

  // Mục "Sổ điểm mẫu môn học"
  readonly subjectGradebookTemplateMenu: Locator;

  // Menu chính "School management" (parent của Classes)
  readonly schoolManagementMenu: Locator;

  // Menu chính "Lớp học"
  readonly classMenu: Locator;

  // Mục "Danh sách lớp học"
  readonly classListItem: Locator;

  // Mục "Điểm nhận xét môn học"
  readonly subjectGradebookScoreAndCommentItem: Locator;

  // Menu con "Thiết lập sổ điểm mẫu"
  readonly gradebookManagementMenu: Locator;

  // Mục "DS sổ điểm mẫu môn học"
  readonly subjectGradebookListMenu: Locator;

  constructor(page: Page) {
    super(page);

    this.gradebookMenu = page.locator(
      'a:has(span:has-text("Sổ điểm")), a:has(span:has-text("Gradebook"))'
    ).first();

    this.subjectGradebookTemplateMenu = page.locator(
      'a:has(span:has-text("Sổ điểm mẫu môn học")), a:has(span:has-text("Subject gradebook templates")), a:has(span:has-text("Sổ điểm mẫu"))'
    ).first();

    this.schoolManagementMenu = page.locator(
      'a:has(span:has-text("Quản lý trường học")), a:has(span:has-text("School management"))'
    ).first();

    this.classMenu = page.locator(
      'a:has(span:has-text("Lớp chủ nhiệm")), a:has(span:has-text("Classes"))'
    ).first();

    this.classListItem = page.locator(
      'a:has(span:has-text("Danh sách")), a:has(span:has-text("Class list"))'
    ).first();

    this.subjectGradebookScoreAndCommentItem = page.locator(
      `a:has(span:has-text("Điểm - nhận xét môn học")), a:has(span:has-text("Subject's scores - comments"))`
    ).first();

    this.gradebookManagementMenu = page.locator(
      'a:has(span:has-text("Thiết lập sổ điểm mẫu")), a:has(span:has-text("Gradebook management"))'
    ).first();

    this.subjectGradebookListMenu = page.locator(
      'a:has(span:has-text("DS sổ điểm môn học")), a:has(span:has-text("Subject gradebook list"))'
    ).first();
  }
}
