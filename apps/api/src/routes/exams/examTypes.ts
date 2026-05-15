export type QRow = {
  id: number;
  section: string;
  part_num?: number;
  question_num?: number;
  question_type: string;
  audio_text: string;
  question_text: string;
  question_romaji: string;
  options: string;
  order_num?: number;
  audio_key?: string | null;
};
