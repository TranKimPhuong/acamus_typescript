import { test } from '@playwright/test';
import { LoginActions } from '../src/actions/LoginActions';
import { TopBarActions } from '../src/actions/TopBarActions';
import { NavigationMenuActions } from '../src/actions/NavigationMenuActions';
import { SubjectGradebookScoreAndCommentActions } from '../src/actions/SubjectGradebookScoreAndCommentActions';
import { VALID_USER } from '../src/data/LoginData';
import { CAMPUS, SCHOOL_YEAR } from '../src/constants/TopBarConstants';
import { TEST_CLASS, SUBJECTS } from '../src/constants/ClassConstants';

async function loginAndSelectContext(page: any) {
  const loginActions = new LoginActions(page);
  const topBarActions = new TopBarActions(page);
  await loginActions.loginAndWaitForDashboard(VALID_USER.username, VALID_USER.password);
  await topBarActions.selectCampusAndSchoolYear(CAMPUS.NAME, SCHOOL_YEAR.NAME);
}

test.describe('Subject Score Gradebook - Điểm nhận xét môn học (12A1_auto)', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  // ── TC_SSG_002 ──────────────────────────────────────────────────────────────
  test('TC_SSG_002 - Chọn course 12A1_auto môn Toán và kiểm tra danh sách học sinh hiện', async ({ page }) => {

    // Bước 1: Đăng nhập SIS
    await loginAndSelectContext(page);

    // Bước 2-3: Vào menu Sổ điểm → Điểm - nhận xét môn học
    const nav = new NavigationMenuActions(page);
    await nav.navigateToScoreGradebookList();

    // Bước 4: Chọn khóa học lớp "12A1_auto" môn Toán, mở trang nhập điểm
    const sgscActions = new SubjectGradebookScoreAndCommentActions(page);
    await sgscActions.selectCourse(TEST_CLASS.NAME, SUBJECTS.TOAN);

    // Bước 5: Kiểm tra danh sách học sinh hiện ra
    await sgscActions.assertStudentListVisible();

    // Bước 6: Nhập điểm/nhận xét theo type của từng cột
    await sgscActions.enterScoresByColumnType();
  });
});
