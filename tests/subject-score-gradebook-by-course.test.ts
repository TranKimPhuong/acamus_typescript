import { test } from '@playwright/test';
import { LoginActions }   from '../src/actions/LoginActions';
import { TopBarActions } from '../src/actions/TopBarActions';
import { SubjectScoreGradebookActions } from '../src/actions/SubjectScoreGradebookActions';
import { VALID_USER } from '../src/data/LoginData';
import { CAMPUS } from '../src/constants/TopBarConstants';
import { SCHOOL_YEAR } from '../src/constants/TopBarConstants';
import { TEST_CLASS } from '../src/constants/ClassConstants';

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function loginAndSelectContext(page: any) {
  const loginActions     = new LoginActions(page);
  const topBarActions = new TopBarActions(page);
  await loginActions.loginAndWaitForDashboard(VALID_USER.username, VALID_USER.password);
  await topBarActions.selectCampusAndSchoolYear(CAMPUS.NAME, SCHOOL_YEAR.NAME);
}

// ─── Test suite ───────────────────────────────────────────────────────────────

test.describe('Nhập điểm môn học - Subject Score Gradebook by Course (12A1_auto)', () => {

  test.setTimeout(600_000); // 10 phút — nhiều lớp bộ môn × nhập 14 cột mỗi lớp

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  // ── TC_SSG_001 ──────────────────────────────────────────────────────────────
  /**
   * Main test: iterate over ALL courses (lớp bộ môn) of class 12A1_auto,
   * enter random scores (5-10) for HK1 and HK2, save, and verify:
   *   1. Saved scores match entered scores
   *   2. HK score = weighted average formula
   *   3. Year (CN) score = (HK1*1 + HK2*2) / 3
   */
  test('TC_SSG_001 - Nhập điểm tất cả lớp bộ môn của 12A1_auto và kiểm tra công thức tính', async ({ page }) => {

    // Step 1: Login & select context
    await loginAndSelectContext(page);
    const actions = new SubjectScoreGradebookActions(page);

    // Step 2: Navigate to the score gradebook by course list
    await actions.nav.navigateToScoreGradebookList();

    // Step 4: Count how many courses belong to 12A1_auto
    const totalCourses = await actions.getCourseCountFor12A1Auto();

    if (totalCourses === 0) {
      throw new Error(
        `Không tìm thấy lớp bộ môn nào chứa tên "${TEST_CLASS.NAME}". ` +
        'Kiểm tra lại bộ lọc hoặc trạng thái danh sách.'
      );
    }

    // Step 5: Process each course in sequence
    for (let i = 0; i < totalCourses; i++) {
      // Go back to list if we navigated away
      if (i > 0) {
        await actions.nav.navigateToScoreGradebookList();
      }
      await actions.processOneCourse(i);
    }
  });

  // ── TC_SSG_002 ──────────────────────────────────────────────────────────────
  /**
   * Focused smoke-test: only the first course of 12A1_auto.
   * Useful for quick verification without iterating all courses.
   */
  test('TC_SSG_002 - Nhập điểm lớp bộ môn đầu tiên của 12A1_auto và kiểm tra công thức', async ({ page }) => {

    await loginAndSelectContext(page);
    const actions = new SubjectScoreGradebookActions(page);

    await actions.nav.navigateToScoreGradebookList();

    const totalCourses = await actions.getCourseCountFor12A1Auto();
    if (totalCourses === 0) {
      throw new Error(`Không tìm thấy lớp bộ môn nào chứa "${TEST_CLASS.NAME}"`);
    }

    await actions.processOneCourse(0);
  });
});
