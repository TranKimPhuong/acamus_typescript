/** Tên cột header không phải cột nhập điểm (band tổng học kỳ), cần loại trừ khỏi getScoreInputColumns */
export const EXCLUDED_SCORE_COLUMN_CAPTIONS = ['Học kỳ 1', 'Học kỳ 2'] as const;

/** Hệ số tính điểm HK1/HK2: HK = Σ(điểm cột * hệ số) / Σ hệ số */
export const SCORE_COLUMN_WEIGHTS: Record<string, number> = {
  'TX1': 1,
  'TX2': 1,
  'TX3': 1,
  'TX4': 1,
  'TX5': 1,
  'Giữa kỳ': 2,
  'Cuối kỳ': 3,
};

/** Hệ số tính điểm Cuối năm: CN = Σ(điểm cột * hệ số) / Σ hệ số */
export const FINAL_SCORE_COLUMN_WEIGHTS: Record<string, number> = {
  'Học kỳ 1': 1,
  'Học kỳ 2': 2,
};

/** Integer random score in [4, 10] */
export function randomScore(): number {
  return Math.floor(Math.random() * 7) + 4;
}
