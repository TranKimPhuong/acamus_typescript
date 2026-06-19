// URLs for score gradebook and precondition pages
export const SCORE_GRADEBOOK_URLS = {
  BY_COURSE_LIST:               'https://sis-qc.sis.flexiapp.cloud/subject-score-gradebook-by-course/list',
  SCHOOL_CLASSES_LIST:          'https://sis-qc.sis.flexiapp.cloud/school-classes/list',
  TEST_CLASS_UPDATE:'https://sis-qc.sis.flexiapp.cloud/school-classes/e93a4857-35da-e59a-b2bc-3a21db1d806a/update',
  SUBJECT_GRADING_BOOK_VIEWS:   'https://sis-qc.sis.flexiapp.cloud/subject-grading-book-views/list',
} as const;

// Input column labels shown in the score entry grid header
export const SCORE_COLS = ['TX1', 'TX2', 'TX3', 'TX4', 'TX5', 'GK', 'CK'] as const;
export type ScoreCol = typeof SCORE_COLS[number];

// Captions used in the DevExtreme DataGrid column headers for GK and CK
// May be "GK"/"CK" or "Giữa kỳ"/"Cuối kỳ" depending on grading book config
export const COL_CAPTION_ALIASES: Record<string, string[]> = {
  GK:  ['GK', 'Giữa kỳ', 'Giua ky'],
  CK:  ['CK', 'Cuối kỳ', 'Cuoi ky'],
  TX1: ['TX1'],
  TX2: ['TX2'],
  TX3: ['TX3'],
  TX4: ['TX4'],
  TX5: ['TX5'],
};

// Semester labels used as band column captions
export const SEMESTER_LABEL = {
  HK1: 'Học kỳ 1',
  HK2: 'Học kỳ 2',
} as const;
export type Semester = keyof typeof SEMESTER_LABEL;

export interface SemesterScores {
  TX1: number; TX2: number; TX3: number;
  TX4: number; TX5: number; GK: number; CK: number;
}

export interface CourseScores {
  hk1: SemesterScores;
  hk2: SemesterScores;
}

// Default weights from template THCS_THPT_MOET_DGBD (used for THPT class 12)
// TX1–TX5 hệ số 1, GK hệ số 2, CK hệ số 3
export const DEFAULT_HK_WEIGHTS: Record<ScoreCol, number> = {
  TX1: 1, TX2: 1, TX3: 1, TX4: 1, TX5: 1,
  GK: 2,
  CK: 3,
};

// HK1 hệ số 1, HK2 hệ số 2 → CN = (HK1*1 + HK2*2) / 3
export const YEAR_WEIGHTS = { HK1: 1, HK2: 2 } as const;

/** Integer random score in [5, 10] */
export function randomScore(): number {
  return Math.floor(Math.random() * 6) + 5;
}

/** Generate random scores for all 7 columns of one semester */
export function generateRandomSemesterScores(): SemesterScores {
  return {
    TX1: randomScore(), TX2: randomScore(), TX3: randomScore(),
    TX4: randomScore(), TX5: randomScore(),
    GK: randomScore(), CK: randomScore(),
  };
}

/** Round to 1 decimal place (Vietnamese grading standard) */
export function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

/**
 * Calculate HK score from 7 column scores and their weights.
 * HK = (TX1*w1 + TX2*w2 + TX3*w3 + TX4*w4 + TX5*w5 + GK*wGK + CK*wCK)
 *      / (w1 + w2 + w3 + w4 + w5 + wGK + wCK)
 */
export function calcHKScore(
  scores: SemesterScores,
  weights: Record<ScoreCol, number> = DEFAULT_HK_WEIGHTS,
): number {
  const num =
    scores.TX1 * weights.TX1 + scores.TX2 * weights.TX2 +
    scores.TX3 * weights.TX3 + scores.TX4 * weights.TX4 +
    scores.TX5 * weights.TX5 + scores.GK * weights.GK +
    scores.CK * weights.CK;
  const den =
    weights.TX1 + weights.TX2 + weights.TX3 + weights.TX4 +
    weights.TX5 + weights.GK + weights.CK;
  return den === 0 ? 0 : round1(num / den);
}

/**
 * Calculate year (CN) score from two semester scores.
 * CN = (HK1 * wHK1 + HK2 * wHK2) / (wHK1 + wHK2)
 */
export function calcYearScore(hk1: number, hk2: number): number {
  const { HK1: w1, HK2: w2 } = YEAR_WEIGHTS;
  return round1((hk1 * w1 + hk2 * w2) / (w1 + w2));
}
