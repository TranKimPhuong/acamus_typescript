import { test, Browser } from '@playwright/test';
import { LoginActions } from '../src/actions/LoginActions';
import { TopBarActions } from '../src/actions/TopBarActions';
import { NavigationMenuActions } from '../src/actions/NavigationMenuActions';
import { SubjectGradebookScoreAndCommentActions } from '../src/actions/SubjectGradebookScoreAndCommentActions';
import { VALID_USER } from '../src/data/LoginData';
import { CAMPUS, SCHOOL_YEAR } from '../src/constants/TopBarConstants';
import { TEST_CLASS_TH } from '../src/data/ClassData';
import { TEST_CLASS_THCS } from '../src/data/ClassData';
import { NO_GRADEBOOK_SUBJECTS } from '../src/constants/ClassConstants';

async function loginAndNavigate(page: any) {
  const loginActions = new LoginActions(page);
  const topBarActions = new TopBarActions(page);
  await loginActions.loginAndWaitForDashboard(VALID_USER.username, VALID_USER.password);
  await topBarActions.selectCampusAndSchoolYear(CAMPUS.NAME, SCHOOL_YEAR.NAME);
  const nav = new NavigationMenuActions(page);
  await nav.navigateToScoreGradebookList();
}

const COURSES_PER_TEST = 2;
const TEST_COUNT = 10;

test.describe.serial('Subject Score Gradebook - TH (4A1_auto)', () => {
  test.setTimeout(300_000);

  let courses: string[] = [];
  let semesters: string[] = [];

  test.beforeAll(async ({ browser }: { browser: Browser }) => {
    const page = await browser.newPage();
    await page.goto('/');
    await loginAndNavigate(page);
    const sgscActions = new SubjectGradebookScoreAndCommentActions(page);

    courses = (await sgscActions.getAvailableCourses(TEST_CLASS_TH.NAME))
      .filter(course => !NO_GRADEBOOK_SUBJECTS.some(subject => course.includes(subject)));
    semesters = await sgscActions.getAvailableSemesters();
    await page.close();
  });

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await loginAndNavigate(page);
  });

  // ── TC_SSG_TH_1..10: chia courses thành 10 nhóm, mỗi nhóm tối đa 2 course ─
  for (let i = 0; i < TEST_COUNT; i++) {
    test(`TC_SSG_TH_${i + 1} - Nhập điểm đủ Học kỳ 1, Học kỳ 2 cho nhóm courses`, async ({ page }) => {
      const start = i * COURSES_PER_TEST;
      const courseChunk = courses.slice(start, start + COURSES_PER_TEST);
      test.skip(courseChunk.length === 0, `Không có course nào ở nhóm ${i + 1}`);

      const sgscActions = new SubjectGradebookScoreAndCommentActions(page);
      for (const course of courseChunk) {
        await test.step(`Nhập điểm cho course: "${TEST_CLASS_TH.NAME}" - Khóa học: "${course}"`, async () => {
          await sgscActions.selectCourse(TEST_CLASS_TH.NAME, course);
          for (const semester of semesters) {
            await sgscActions.selectSemester(semester);
            await sgscActions.assertStudentListVisible();
            await sgscActions.enterScoresByColumnType();
          }
        });
      }
    });
  }
});

test.describe.serial('Subject Score Gradebook - THCS (12A1_auto)', () => {
  test.setTimeout(300_000);

  let courses: string[] = [];
  let semesters: string[] = [];

  test.beforeAll(async ({ browser }: { browser: Browser }) => {
    const page = await browser.newPage();
    await page.goto('/');
    await loginAndNavigate(page);
    const sgscActions = new SubjectGradebookScoreAndCommentActions(page);

    courses = (await sgscActions.getAvailableCourses(TEST_CLASS_THCS.NAME))
      .filter(course => !NO_GRADEBOOK_SUBJECTS.some(subject => course.includes(subject)));
    semesters = await sgscActions.getAvailableSemesters();
    await page.close();
  });

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await loginAndNavigate(page);
  });

  // ── TC_SSG_THCS_1..10: chia courses thành 10 nhóm, mỗi nhóm tối đa 2 course ─
  for (let i = 0; i < TEST_COUNT; i++) {
    test(`TC_SSG_THCS_${i + 1} - Nhập điểm đủ Học kỳ 1, Học kỳ 2 cho nhóm courses`, async ({ page }) => {
      const start = i * COURSES_PER_TEST;
      const courseChunk = courses.slice(start, start + COURSES_PER_TEST);
      test.skip(courseChunk.length === 0, `Không có course nào ở nhóm ${i + 1}`);

      const sgscActions = new SubjectGradebookScoreAndCommentActions(page);
      for (const course of courseChunk) {
        await test.step(`Nhập điểm cho course: "${TEST_CLASS_THCS.NAME}" - Khóa học: "${course}"`, async () => {
          await sgscActions.selectCourse(TEST_CLASS_THCS.NAME, course);
          for (const semester of semesters) {
            await sgscActions.selectSemester(semester);
            await sgscActions.assertStudentListVisible();
            await sgscActions.enterScoresByColumnType();
          }
        });
      }
    });
  }
});
