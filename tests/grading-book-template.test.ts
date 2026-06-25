import { test, expect } from '@playwright/test';
import { LoginActions } from '../src/actions/LoginActions';
import { TopBarActions } from '../src/actions/TopBarActions';
import { SubjectGradebookTemplateActions } from '../src/actions/SubjectGradebookTemplateActions';
import { SubjectGradebookTemplateDetailActions } from '../src/actions/SubjectGradebookTemplateDetailActions';
import { VALID_USER } from '../src/data/LoginData';
import { CAMPUS, SCHOOL_YEAR } from '../src/constants/TopBarConstants';
import { SYSTEM_GRADING_BOOK_TEMPLATES } from '../src/constants/SubjectGradebookTemplateConstants';
import { TH_MOET_DGDK_MUCDATDUOC_DETAIL } from '../src/constants/SubjectGradebookTemplateDetailConstants';
import { TH_MOET_MUCDATDUOC_DETAIL } from '../src/constants/SubjectGradebookTemplateDetailConstants';
import { THCS_THPT_MOET_DGBD_DETAIL } from '../src/constants/SubjectGradebookTemplateDetailConstants';
import { THCS_THPT_MOET_DGNX_DETAIL } from '../src/constants/SubjectGradebookTemplateDetailConstants';

test.describe('Sổ điểm mẫu - Subject Grading Book Templates', () => {

  test.setTimeout(300000); // 5 phút — nhiều cột × nhiều assertions

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  // ─── TC_SGBT_001 ─────────────────────────────────────────────────────────────
  test('TC_SGBT_001 - Danh sách sổ điểm mẫu do hệ thống tạo hiển thị đủ 4 mẫu', async ({ page }) => {
    const loginActions = new LoginActions(page);
    const topBarActions = new TopBarActions(page);
    const templateActions = new SubjectGradebookTemplateActions(page);

    // Step 1: Login
    await loginActions.loginAndWaitForDashboard(VALID_USER.username, VALID_USER.password);

    // Step 2: Chọn campus và năm học
    await topBarActions.selectCampusAndSchoolYear(CAMPUS.NAME, SCHOOL_YEAR.NAME);

    // Step 3: Qua menu chọn Sổ điểm > Sổ điểm mẫu môn học
    await templateActions.nav.navigateToSubjectGradebookTemplateViaMenu();

    // Step 4: Kiểm tra URL
    await templateActions.assertTemplateListUrl();

    // Step 5: Kiểm tra đủ 4 sổ điểm mẫu do hệ thống tạo
    await templateActions.assertAllSystemTemplatesExist(SYSTEM_GRADING_BOOK_TEMPLATES);
  });

  // ─── TC_SGBT_002 ─────────────────────────────────────────────────────────────
  test('TC_SGBT_002 - Sổ điểm TH_MOET_DGDK_MUCDATDUOC tồn tại trong danh sách', async ({ page }) => {
    const loginActions = new LoginActions(page);
    const topBarActions = new TopBarActions(page);
    const templateActions = new SubjectGradebookTemplateActions(page);

    await loginActions.loginAndWaitForDashboard(VALID_USER.username, VALID_USER.password);
    await topBarActions.selectCampus(CAMPUS.NAME);
    await topBarActions.selectSchoolYear(SCHOOL_YEAR.NAME);
    await templateActions.nav.navigateToSubjectGradebookTemplateViaMenu();

    await templateActions.assertTemplateExists(SYSTEM_GRADING_BOOK_TEMPLATES[0]);
  });

  // ─── TC_SGBT_003 ─────────────────────────────────────────────────────────────
  test('TC_SGBT_003 - Sổ điểm TH_MOET_MUCDATDUOC tồn tại trong danh sách', async ({ page }) => {
    const loginActions = new LoginActions(page);
    const topBarActions = new TopBarActions(page);
    const templateActions = new SubjectGradebookTemplateActions(page);

    await loginActions.loginAndWaitForDashboard(VALID_USER.username, VALID_USER.password);
    await topBarActions.selectCampus(CAMPUS.NAME);
    await topBarActions.selectSchoolYear(SCHOOL_YEAR.NAME);
    await templateActions.nav.navigateToSubjectGradebookTemplateViaMenu();

    await templateActions.assertTemplateExists(SYSTEM_GRADING_BOOK_TEMPLATES[1]);
  });

  // ─── TC_SGBT_004 ─────────────────────────────────────────────────────────────
  test('TC_SGBT_004 - Sổ điểm THCS_THPT_MOET_DGBD tồn tại trong danh sách', async ({ page }) => {
    const loginActions = new LoginActions(page);
    const topBarActions = new TopBarActions(page);
    const templateActions = new SubjectGradebookTemplateActions(page);

    await loginActions.loginAndWaitForDashboard(VALID_USER.username, VALID_USER.password);
    await topBarActions.selectCampus(CAMPUS.NAME);
    await topBarActions.selectSchoolYear(SCHOOL_YEAR.NAME);
    await templateActions.nav.navigateToSubjectGradebookTemplateViaMenu();

    await templateActions.assertTemplateExists(SYSTEM_GRADING_BOOK_TEMPLATES[2]);
  });

  // ─── TC_SGBT_005 ─────────────────────────────────────────────────────────────
  test('TC_SGBT_005 - Sổ điểm THCS_THPT_MOET_DGNX tồn tại trong danh sách', async ({ page }) => {
    const loginActions = new LoginActions(page);
    const topBarActions = new TopBarActions(page);
    const templateActions = new SubjectGradebookTemplateActions(page);

    await loginActions.loginAndWaitForDashboard(VALID_USER.username, VALID_USER.password);
    await topBarActions.selectCampus(CAMPUS.NAME);
    await topBarActions.selectSchoolYear(SCHOOL_YEAR.NAME);
    await templateActions.nav.navigateToSubjectGradebookTemplateViaMenu();

    await templateActions.assertTemplateExists(SYSTEM_GRADING_BOOK_TEMPLATES[3]);
  });

 
  // ─── TC_SGBT_006 ─────────────────────────────────────────────────────────────
  test('TC_SGBT_006 - Kiểm tra default values của sổ điểm TH_MOET_DGDK_MUCDATDUOC', async ({ page }) => {
    const loginActions     = new LoginActions(page);
    const topBarActions = new TopBarActions(page);
    const templateActions  = new SubjectGradebookTemplateActions(page);
    const detailActions    = new SubjectGradebookTemplateDetailActions(page);

    await loginActions.loginAndWaitForDashboard(VALID_USER.username, VALID_USER.password);
    await topBarActions.selectCampus(CAMPUS.NAME);
    await topBarActions.selectSchoolYear(SCHOOL_YEAR.NAME);
    await templateActions.nav.navigateToSubjectGradebookTemplateViaMenu();
    await detailActions.openTemplateByCode(TH_MOET_DGDK_MUCDATDUOC_DETAIL.code);
    await detailActions.assertTotalItems(TH_MOET_DGDK_MUCDATDUOC_DETAIL);
    await detailActions.assertFinalScore(TH_MOET_DGDK_MUCDATDUOC_DETAIL.finalScore);
    await detailActions.assertAllColumnConfigs(TH_MOET_DGDK_MUCDATDUOC_DETAIL);
  });

  // ─── TC_SGBT_007 ────────────────────────────────────────────────────────────
  //phát hiện con bug, chờ fix xong run lại
  test('TC_SGBT_007 - Kiểm tra chi tiết từng cột của sổ điểm TH_MOET_DGDK_MUCDATDUOC', async ({ page }) => {
    const loginActions     = new LoginActions(page);
    const topBarActions = new TopBarActions(page);
    const templateActions  = new SubjectGradebookTemplateActions(page);
    const detailActions    = new SubjectGradebookTemplateDetailActions(page);

    await loginActions.loginAndWaitForDashboard(VALID_USER.username, VALID_USER.password);
    await topBarActions.selectCampus(CAMPUS.NAME);
    await topBarActions.selectSchoolYear(SCHOOL_YEAR.NAME);
    await templateActions.nav.navigateToSubjectGradebookTemplateViaMenu();
    await detailActions.openTemplateByCode(TH_MOET_DGDK_MUCDATDUOC_DETAIL.code);
    await detailActions.assertAllSubGradingItemDetails(TH_MOET_DGDK_MUCDATDUOC_DETAIL);
  });
 


  //─── TC_SGBT_008 ─────────────────────────────────────────────────────────────
  test('TC_SGBT_008 - Kiểm tra default values của sổ điểm TH_MOET_MUCDATDUOC', async ({ page }) => {
    const loginActions     = new LoginActions(page);
    const topBarActions = new TopBarActions(page);
    const templateActions  = new SubjectGradebookTemplateActions(page);
    const detailActions    = new SubjectGradebookTemplateDetailActions(page);

    await loginActions.loginAndWaitForDashboard(VALID_USER.username, VALID_USER.password);
    await topBarActions.selectCampus(CAMPUS.NAME);
    await topBarActions.selectSchoolYear(SCHOOL_YEAR.NAME);
    await templateActions.nav.navigateToSubjectGradebookTemplateViaMenu();
    await detailActions.openTemplateByCode(TH_MOET_MUCDATDUOC_DETAIL.code);
    await detailActions.assertTotalItems(TH_MOET_MUCDATDUOC_DETAIL);
    await detailActions.assertFinalScore(TH_MOET_MUCDATDUOC_DETAIL.finalScore);
    await detailActions.assertAllColumnConfigs(TH_MOET_MUCDATDUOC_DETAIL);
  });

  // ─── TC_SGBT_009 - Chi tiết từng cột ─────────────────────────────────────────
  test('TC_SGBT_009 - Kiểm tra chi tiết từng cột của sổ điểm TH_MOET_MUCDATDUOC', async ({ page }) => {
    const loginActions     = new LoginActions(page);
    const topBarActions = new TopBarActions(page);
    const templateActions  = new SubjectGradebookTemplateActions(page);
    const detailActions    = new SubjectGradebookTemplateDetailActions(page);

    await loginActions.loginAndWaitForDashboard(VALID_USER.username, VALID_USER.password);
    await topBarActions.selectCampus(CAMPUS.NAME);
    await topBarActions.selectSchoolYear(SCHOOL_YEAR.NAME);
    await templateActions.nav.navigateToSubjectGradebookTemplateViaMenu();
    await detailActions.openTemplateByCode(TH_MOET_MUCDATDUOC_DETAIL.code);
    await detailActions.assertAllSubGradingItemDetails(TH_MOET_MUCDATDUOC_DETAIL);
  });

  // ─── TC_SGBT_010 ─────────────────────────────────────────────────────────────
  test('TC_SGBT_010 - Kiểm tra default values của sổ điểm THCS_THPT_MOET_DGBD', async ({ page }) => {
    const loginActions     = new LoginActions(page);
    const topBarActions = new TopBarActions(page);
    const templateActions  = new SubjectGradebookTemplateActions(page);
    const detailActions    = new SubjectGradebookTemplateDetailActions(page);

    await loginActions.loginAndWaitForDashboard(VALID_USER.username, VALID_USER.password);
    await topBarActions.selectCampus(CAMPUS.NAME);
    await topBarActions.selectSchoolYear(SCHOOL_YEAR.NAME);
    await templateActions.nav.navigateToSubjectGradebookTemplateViaMenu();
    await detailActions.openTemplateByCode(THCS_THPT_MOET_DGBD_DETAIL.code);
    await detailActions.assertTotalItems(THCS_THPT_MOET_DGBD_DETAIL);
    await detailActions.assertFinalScore(THCS_THPT_MOET_DGBD_DETAIL.finalScore);
    await detailActions.assertAllColumnConfigs(THCS_THPT_MOET_DGBD_DETAIL);
  });

  // ─── TC_SGBT_011 - Chi tiết từng cột ─────────────────────────────────────────
  test(`TC_SGBT_011 - Kiểm tra chi tiết từng cột của sổ điểm THCS_THPT_MOET_DGBD`, async ({ page }) => {
    const loginActions     = new LoginActions(page);
    const topBarActions = new TopBarActions(page);
    const templateActions  = new SubjectGradebookTemplateActions(page);
    const detailActions    = new SubjectGradebookTemplateDetailActions(page);

    await loginActions.loginAndWaitForDashboard(VALID_USER.username, VALID_USER.password);
    await topBarActions.selectCampus(CAMPUS.NAME);
    await topBarActions.selectSchoolYear(SCHOOL_YEAR.NAME);
    await templateActions.nav.navigateToSubjectGradebookTemplateViaMenu();
    await detailActions.openTemplateByCode(THCS_THPT_MOET_DGBD_DETAIL.code);
    await detailActions.assertAllSubGradingItemDetails(THCS_THPT_MOET_DGBD_DETAIL);
  });

  // ─── TC_SGBT_012 ─────────────────────────────────────────────────────────────
  test('TC_SGBT_012 - Kiểm tra default values của sổ điểm THCS_THPT_MOET_DGNX', async ({ page }) => {
    const loginActions     = new LoginActions(page);
    const topBarActions = new TopBarActions(page);
    const templateActions  = new SubjectGradebookTemplateActions(page);
    const detailActions    = new SubjectGradebookTemplateDetailActions(page);

    await loginActions.loginAndWaitForDashboard(VALID_USER.username, VALID_USER.password);
    await topBarActions.selectCampus(CAMPUS.NAME);
    await topBarActions.selectSchoolYear(SCHOOL_YEAR.NAME);
    await templateActions.nav.navigateToSubjectGradebookTemplateViaMenu();
    await detailActions.openTemplateByCode(THCS_THPT_MOET_DGNX_DETAIL.code);
    await detailActions.assertTotalItems(THCS_THPT_MOET_DGNX_DETAIL);
    await detailActions.assertFinalScore(THCS_THPT_MOET_DGNX_DETAIL.finalScore);
    await detailActions.assertAllColumnConfigs(THCS_THPT_MOET_DGNX_DETAIL);
  });

  // ─── TC_SGBT_013 - Chi tiết từng cột ─────────────────────────────────────────
  test('TC_SGBT_013 - Kiểm tra chi tiết từng cột của sổ điểm THCS_THPT_MOET_DGNX', async ({ page }) => {
    const loginActions     = new LoginActions(page);
    const topBarActions = new TopBarActions(page);
    const templateActions  = new SubjectGradebookTemplateActions(page);
    const detailActions    = new SubjectGradebookTemplateDetailActions(page);

    await loginActions.loginAndWaitForDashboard(VALID_USER.username, VALID_USER.password);
    await topBarActions.selectCampus(CAMPUS.NAME);
    await topBarActions.selectSchoolYear(SCHOOL_YEAR.NAME);
    await templateActions.nav.navigateToSubjectGradebookTemplateViaMenu();
    await detailActions.openTemplateByCode(THCS_THPT_MOET_DGNX_DETAIL.code);
    await detailActions.assertAllSubGradingItemDetails(THCS_THPT_MOET_DGNX_DETAIL);
  });

});