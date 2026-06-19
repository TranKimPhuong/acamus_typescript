import { Page } from '@playwright/test';
import { SubjectGradingBookListPage } from '../pages/SubjectGradingBookListPage';
import { Logger } from '../libs/Logger';
import { SCORE_GRADEBOOK_URLS } from '../constants/SubjectScoreGradebookConstants';
import { TEST_CLASS } from '../constants/ClassConstants';

export class SubjectGradingBookListActions {
  private page: Page;
  private listPage: SubjectGradingBookListPage;
  private logger: Logger;

  constructor(page: Page) {
    this.page = page;
    this.listPage = new SubjectGradingBookListPage(page);
    this.logger = new Logger('SubjectGradingBookListActions');
  }

  async verifyGradingBookViewsExist(): Promise<boolean> {
    this.logger.step(`Kiểm tra sổ điểm mẫu cho "${TEST_CLASS.GRADE_BLOCK}" đã được thêm`);
    await this.page.goto(SCORE_GRADEBOOK_URLS.SUBJECT_GRADING_BOOK_VIEWS);
    await this.listPage.waitForPageLoad();
    await this.page.waitForTimeout(2000);

    const visible = await this.listPage.gradeBlockRow(TEST_CLASS.GRADE_BLOCK).isVisible().catch(() => false);
    if (visible) {
      this.logger.info(`Sổ điểm mẫu cho "${TEST_CLASS.GRADE_BLOCK}" tồn tại ✓`);
    } else {
      this.logger.error(`Sổ điểm mẫu cho "${TEST_CLASS.GRADE_BLOCK}" KHÔNG tìm thấy`);
    }
    return visible;
  }

  async assertGradingBookViewsOrSkip(): Promise<void> {
    const ok = await this.verifyGradingBookViewsExist();
    if (!ok) throw new Error(`[PRECONDITION FAIL] Sổ điểm "${TEST_CLASS.GRADE_BLOCK}" chưa được thêm`);
  }
}
