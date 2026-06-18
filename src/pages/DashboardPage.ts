import { Page, Locator } from '@playwright/test';
import { BasePage } from '../libs/BasePage';

export class DashboardPage extends BasePage {
  // ── User / logout menu ────────────────────────────────────────────────────
  readonly userMenuButton: Locator;
  readonly logoutButton: Locator;
  readonly logoutConfirmButton: Locator;

  // ── Campus & school-year selection (same top frame) ───────────────────────
  readonly campusDropdown: Locator;
  readonly schoolYearDropdown: Locator;
  readonly confirmButton: Locator;

  campusOption(campusName: string): Locator {
    return this.page.locator(
      `a:has-text("${campusName}"), .ant-select-item-option:has-text("${campusName}"), [class*="option"]:has-text("${campusName}")`
    ).first();
  }

  schoolYearOption(yearName: string): Locator {
    return this.page.locator(
      `a:has-text("${yearName}"), .ant-select-item-option:has-text("${yearName}"), [class*="option"]:has-text("${yearName}")`
    ).first();
  }

  constructor(page: Page) {
    super(page);

    this.userMenuButton = page.locator(
      'span.dropdown-toggle.user-full-name, [class*="user-full-name"]'
    ).first();

    this.logoutButton = page.locator(
      'a.dropdown-item.pointer:has-text("Đăng xuất"), a.dropdown-item.pointer:has-text("Log out")'
    ).first();

    this.logoutConfirmButton = page.locator(
      'button:has-text("Yes"), button:has-text("Confirm"), button:has-text("OK")'
    ).first();

    // <div> cha chứa <span>Campus</span> và <a role="button"> là anh chị em
    this.campusDropdown = page.locator(
      'div:has(span:has-text("Campus")) > a[role="button"], div:has(span:has-text("Cơ sở")) > a[role="button"]'
    ).first();

    // <div> cha chứa <span>School years</span> và <a role="button"> là anh chị em
    this.schoolYearDropdown = page.locator(
      'div:has(span:has-text("School years")) > a[role="button"], div:has(span:has-text("Năm học")) > a[role="button"]'
    ).first();

    this.confirmButton = page.locator(
      'button:has-text("Xác nhận"), button:has-text("Confirm"), button:has-text("OK"), button:has-text("Tiếp tục"), button[type="submit"]'
    ).first();
  }
}
