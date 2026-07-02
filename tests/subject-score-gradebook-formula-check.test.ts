import { test } from '@playwright/test';
import { LoginActions } from '../src/actions/LoginActions';
import { TopBarActions } from '../src/actions/TopBarActions';
import { NavigationMenuActions } from '../src/actions/NavigationMenuActions';
import { SubjectGradebookScoreAndCommentActions } from '../src/actions/SubjectGradebookScoreAndCommentActions';
import { VALID_USER } from '../src/data/LoginData';
import { CAMPUS, SCHOOL_YEAR } from '../src/constants/TopBarConstants';
import { CLASS_NAME, COURSE_NAME, STUDENT_CODES } from '../src/data/SubjectGradebookFormulaCheckData';

async function loginAndNavigate(page: any) {
  const loginActions = new LoginActions(page);
  const topBarActions = new TopBarActions(page);
  await loginActions.loginAndWaitForDashboard(VALID_USER.username, VALID_USER.password);
  await topBarActions.selectCampusAndSchoolYear(CAMPUS.NAME, SCHOOL_YEAR.NAME);
  const nav = new NavigationMenuActions(page);
  await nav.navigateToScoreGradebookList();
}

test.setTimeout(300_000);

test('TC_SSG_FORMULA - Nhập điểm số cho HS chỉ định để kiểm tra công thức HK1/HK2/CN', async ({ page }) => {
  await page.goto('/');
  await loginAndNavigate(page);

  const sgscActions = new SubjectGradebookScoreAndCommentActions(page);
  const semesters = await sgscActions.getAvailableSemesters();

  await sgscActions.selectCourse(CLASS_NAME, COURSE_NAME);
  for (const semester of semesters) {
    await sgscActions.selectSemester(semester);
    await sgscActions.assertStudentListVisible();
    await sgscActions.enterNumericScoresForStudents(STUDENT_CODES);
  }
});
