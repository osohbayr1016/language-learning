export type ImportedVocab = {
  hanzi: string;
  pinyin: string;
  meaning_mn: string;
  hsk_level: number;
};

export type ImportedDialogueLine = {
  speaker?: string;
  cn: string;
  mn: string;
};

export type ImportedDialogue = {
  no: number;
  title: string;
  lines?: ImportedDialogueLine[];
  text_cn?: string;
  text_mn?: string;
};

export type ImportedNote = {
  title: string;
  body: string;
};

export type ImportedWorkbookItem = {
  q: string;
  options?: string[];
  answer?: string | boolean | null;
  parts?: string[];
};

export type ImportedWorkbookSection = {
  type: string;
  title: string;
  bank?: string[];
  items: ImportedWorkbookItem[];
};

export type ImportedLessonContent = {
  external_lesson_id: string;
  title_cn: string;
  title_mn: string;
  source: string;
  summary: string;
  dialogues: ImportedDialogue[];
  vocab: ImportedVocab[];
  grammar: ImportedNote[];
  slang: ImportedNote[];
  workbook: { sections: ImportedWorkbookSection[] };
  quizlet_text: string;
  mock_exam_template_id?: number;
};

export type LessonHtmlPreview = {
  external_lesson_id: string;
  title_cn: string;
  title_mn: string;
  source: string;
  vocab_count: number;
  dialogue_count: number;
  grammar_count: number;
  workbook_count: number;
  warnings: string[];
};

export type LessonImportResult = LessonHtmlPreview & {
  lesson_id: number;
  inserted_words: number;
  reused_words: number;
  linked_words: number;
};
