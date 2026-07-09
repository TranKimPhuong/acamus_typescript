import { Page } from '@playwright/test';
import { ClassDetailPage } from '../pages/ClassDetailPage';
import { Logger } from '../libs/Logger';
import { TEST_CLASS_THCS } from '../data/ClassData';

export class ClassDetailActions {
  private classDetailPage: ClassDetailPage;
  private logger: Logger;

  constructor(page: Page) {
    this.classDetailPage = new ClassDetailPage(page);
    this.logger = new Logger('ClassDetailActions');
  }

  async verifyClassHasStudents(): Promise<boolean> {
    this.logger.step(`Kiểm tra lớp "${TEST_CLASS_THCS.NAME}" có ít nhất 1 học sinh`);
    await this.classDetailPage.waitForPageLoad();

    const count = await this.classDetailPage.studentRows.count().catch(() => 0);
    if (count > 0) {
      this.logger.info(`Lớp có ${count} học sinh ✓`);
    } else {
      this.logger.error('Lớp KHÔNG có học sinh nào');
    }
    return count > 0;
  }

  async assertClassHasStudents(): Promise<void> {
    const ok = await this.verifyClassHasStudents();
    if (!ok) throw new Error(`Lớp "${TEST_CLASS_THCS.NAME}" không có học sinh`);
  }
}
