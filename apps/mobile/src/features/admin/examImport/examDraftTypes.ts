export type ExamDraftQuestion = {
  section: 'listening' | 'reading';
  part_num: number;
  question_num: number;
  audio_text: string;
  question_text: string;
  question_pinyin: string;
  options: string[];
  correct_answer: string;
  order_num: number;
  audio_key?: string | null;
};
