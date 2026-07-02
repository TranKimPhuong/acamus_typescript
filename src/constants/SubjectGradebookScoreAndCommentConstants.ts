/** Tên cột header không phải cột nhập điểm (band tổng học kỳ), cần loại trừ khỏi getScoreInputColumns */
export const EXCLUDED_SCORE_COLUMN_CAPTIONS = ['Học kỳ 1', 'Học kỳ 2'] as const;

/** Integer random score in [4, 10] */
export function randomScore(): number {
  return Math.floor(Math.random() * 7) + 4;
}
