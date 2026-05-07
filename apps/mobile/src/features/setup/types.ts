export type ChineseLevel = 'none' | 'hsk1' | 'hsk2' | 'hsk3' | 'hsk4' | 'hsk5' | 'hsk6';

export type LearningReason = 'university' | 'career' | 'travel' | 'culture' | 'fun';

export type SetupAnswers = {
  level: ChineseLevel | null;
  reason: LearningReason | null;
  name: string;
  email: string;
  password: string;
};

export const TOTAL_STEPS = 5;
