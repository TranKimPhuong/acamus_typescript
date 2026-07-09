export const GRADEBOOK_TEMPLATE = {
  SCORE:   'Sổ điểm MOET - Trung học - Đánh giá bằng điểm',
  COMMENT: 'Sổ điểm MOET - Trung học - Đánh giá nhận xét',
} as const;

export const SUBJECTS = {
  TOAN:                'Toán',
  TIENG_ANH:           'Tiếng Anh',
  TIN_HOC:             'Tin học',
  VAT_LI:              'Vật lí',
  HOA_HOC:             'Hóa học',
  SINH_HOC:            'Sinh học',
  CONG_NGHE:           'Công nghệ',
  LICH_SU:             'Lịch sử',
  NGU_VAN:             'Ngữ văn',
  GIAO_DUC_THE_CHAT:   'Giáo dục thể chất',
  HOAT_DONG_TRAI_NGHIEM: 'Hoạt động trải nghiệm',
  GIAO_DUC_DIA_PHUONG: 'Giáo dục địa phương',
  GIAO_DUC_QPAN:       'Giáo dục QPAN',
  GIAO_DUC_CONG_DAN:   'Giáo dục công dân',
  SINH_HOAT_CHU_NHIEM: 'Sinh hoạt chủ nhiệm',
} as const;

/** Các môn chấm bằng điểm số */
export const SCORE_SUBJECTS = [
  'Toán', 'Tiếng Anh', 'Tin học', 'Vật lí', 'Hóa học',
  'Sinh học', 'Công nghệ', 'Lịch sử', 'Ngữ văn',
  'KHTN/Lí', 'KHTN/Hóa', 'KHTN/Sinh học',
] as const;

/** Các môn chấm bằng nhận xét */
export const COMMENT_SUBJECTS = [
  'Giáo dục thể chất', 'Hoạt động trải nghiệm',
  'Giáo dục địa phương', 'Giáo dục QPAN', 'Giáo dục công dân',
] as const;

/** Môn không gán sổ điểm */
export const NO_GRADEBOOK_SUBJECTS = [
  'Sinh hoạt chủ nhiệm',
] as const;
