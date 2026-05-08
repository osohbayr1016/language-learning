export type QRow = {
  id: number;
  section: string;
  part_num?: number;
  question_num?: number;
  question_type: string;
  audio_text: string;
  question_text: string;
  question_pinyin: string;
  options: string;
  order_num?: number;
};
