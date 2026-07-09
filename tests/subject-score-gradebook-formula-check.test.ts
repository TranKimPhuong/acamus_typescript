import { test } from '@playwright/test';
import { LoginActions } from '../src/actions/LoginActions';
import { TopBarActions } from '../src/actions/TopBarActions';
import { NavigationMenuActions } from '../src/actions/NavigationMenuActions';
import { SubjectGradebookScoreAndCommentActions } from '../src/actions/SubjectGradebookScoreAndCommentActions';
import { VALID_USER } from '../src/data/LoginData';
import { CAMPUS, SCHOOL_YEAR } from '../src/constants/TopBarConstants';
import {
  CLASS_NAME_THCS,
  COURSE_NAME_THCS_SCORE_NUMBER,
  COURSE_NAME_THCS_SCORE_LETTER,
  STUDENT_CODES_THCS,
  CLASS_NAME_TH,
  COURSE_NAME_TH_SCORE_NUMBER,
  COURSE_NAME_TH_SCORE_LETTER,
  STUDENT_CODES_TH,
} from '../src/data/SubjectGradebookScoreAndCommentData';

async function loginAndNavigate(page: any) {
  const loginActions = new LoginActions(page);
  const topBarActions = new TopBarActions(page);
  await loginActions.loginAndWaitForDashboard(VALID_USER.username, VALID_USER.password);
  await topBarActions.selectCampusAndSchoolYear(CAMPUS.NAME, SCHOOL_YEAR.NAME);
  const nav = new NavigationMenuActions(page);
  await nav.navigateToScoreGradebookList();
}

test.setTimeout(300_000);

test(
  'TC_SSG_FORMULA - Nhập điểm số cho HS chỉ định để kiểm tra công thức HK1/HK2/CN - Điểm số ',
  { tag: ['@formula-check', '@thcs', '@number'] },
  async ({ page }) => {
    await page.goto('/');
    await loginAndNavigate(page);

    const sgscActions = new SubjectGradebookScoreAndCommentActions(page);
    const semesters = await sgscActions.getAvailableSemesters();

    await sgscActions.selectCourse(CLASS_NAME_THCS, COURSE_NAME_THCS_SCORE_NUMBER);
    const excludeCols: string[] = ['Học kỳ 1', 'Học kỳ 2'];
    for (const semester of semesters) {
      await sgscActions.selectSemester(semester);
      await sgscActions.assertStudentListVisible();
      const scores = await sgscActions.enterNumericScoresForStudents(STUDENT_CODES_THCS, excludeCols);
      // kiểm tra HK1, HK2 có được tính đúng hay không, dựa vào các điểm số vừa nhập
      await sgscActions.assertSemesterScoreFormula(scores, semester, STUDENT_CODES_THCS);
    }
    // Xóa filter semester
    await sgscActions.selectSemester('');
    await sgscActions.assertFinalScoreFormula(STUDENT_CODES_THCS);
  }
);

test(
  'TC_SSG_FORMULA - Nhập điểm chữ cho HS chỉ định để kiểm tra công thức HK1/HK2/CN - Điểm chữ',
  { tag: ['@formula-check', '@thcs', '@letter'] },
  async ({ page }) => {
    await page.goto('/');
    await loginAndNavigate(page);

    const sgscActions = new SubjectGradebookScoreAndCommentActions(page);
    const semesters = await sgscActions.getAvailableSemesters();

    await sgscActions.selectCourse(CLASS_NAME_THCS, COURSE_NAME_THCS_SCORE_LETTER);
    const excludeCols: string[] = ['Học kỳ 1', 'Học kỳ 2'];
    for (const semester of semesters) {
      await sgscActions.selectSemester(semester);
      await sgscActions.assertStudentListVisible();
      const scores = await sgscActions.enterLetterScoresForStudents(STUDENT_CODES_THCS, excludeCols);
      // HK = "Đạt" nếu tất cả cột TX/GK/CK = "Đạt", "Chưa đạt" nếu có ít nhất 1 cột = "Chưa đạt"
      await sgscActions.assertSemesterLetterFormula(scores, semester, STUDENT_CODES_THCS);
    }
    // Xóa filter semester
    await sgscActions.selectSemester('');
    // CN = HK2
    await sgscActions.assertFinalLetterFormula(STUDENT_CODES_THCS);
  }
);

test(
  'TC_SSG_FORMULA - Nhập điểm số cho HS chỉ định để kiểm tra công thức HK1/HK2/CN - Tiểu học - Điểm số',
  { tag: ['@formula-check', '@th', '@number'] },
  async ({ page }) => {
    await page.goto('/');
    await loginAndNavigate(page);

    const sgscActions = new SubjectGradebookScoreAndCommentActions(page);
    const semesters = await sgscActions.getAvailableSemesters();

    await sgscActions.selectCourse(CLASS_NAME_TH, COURSE_NAME_TH_SCORE_NUMBER);
    const excludeCols: string[] = ['Học kỳ 1', 'Học kỳ 2'];
    for (const semester of semesters) {
      await sgscActions.selectSemester(semester);
      await sgscActions.assertStudentListVisible();
      const scores = await sgscActions.enterNumericScoresForStudents(STUDENT_CODES_TH, excludeCols);
      // Bậc Tiểu học: HK1 = Cuối kỳ 1, HK2 = Cuối kỳ 2 (copy nguyên giá trị, ko phải trung bình trọng số)
      const sourceCol = semester.replace('Học kỳ', 'Cuối kỳ');
      await sgscActions.assertSemesterScoreCopyFormula(scores, semester, sourceCol, STUDENT_CODES_TH);
    }
    // Xóa filter semester
    await sgscActions.selectSemester('');
    // CN = HK2
    await sgscActions.assertFinalScoreCopyFormula(STUDENT_CODES_TH);
  }
);

test(
  'TC_SSG_FORMULA - Nhập điểm chữ cho HS chỉ định để kiểm tra công thức HK1/HK2/CN - Tiểu học - Điểm chữ',
  { tag: ['@formula-check', '@th', '@letter'] },
  async ({ page }) => {
    await page.goto('/');
    await loginAndNavigate(page);

    const sgscActions = new SubjectGradebookScoreAndCommentActions(page);
    const semesters = await sgscActions.getAvailableSemesters();

    await sgscActions.selectCourse(CLASS_NAME_TH, COURSE_NAME_TH_SCORE_LETTER);
    const excludeCols: string[] = ['Học kỳ 1', 'Học kỳ 2'];
    for (const semester of semesters) {
      await sgscActions.selectSemester(semester);
      await sgscActions.assertStudentListVisible();
      const scores = await sgscActions.enterLetterScoresForStudents(STUDENT_CODES_TH, excludeCols);
      // Bậc Tiểu học: HK1 = Mức đạt được - CK1, HK2 = Mức đạt được - CK2 (copy nguyên giá trị)
      const semesterNum = semester.replace(/\D/g, '');
      const sourceCol = `Mức đạt được - CK${semesterNum}`;
      await sgscActions.assertSemesterLetterCopyFormula(scores, semester, sourceCol, STUDENT_CODES_TH);
    }
    // Xóa filter semester
    await sgscActions.selectSemester('');
    // CN = HK2
    await sgscActions.assertFinalLetterFormula(STUDENT_CODES_TH);
  }
);
