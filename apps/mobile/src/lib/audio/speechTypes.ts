export type SpeechState = 'idle' | 'requesting' | 'listening' | 'processing' | 'error';
export type SpeechResult = { transcript: string; confidence: number };
