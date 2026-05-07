// ============================================================
// AUTH TYPES
// ============================================================
export interface User {
  id: number;
  email: string;
  display_name: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  display_name: string;
}

// ============================================================
// WORD / VOCABULARY TYPES
// ============================================================
export type HskLevel = 1 | 2 | 3 | 4 | 5 | 6;

export type ToneNumber = 1 | 2 | 3 | 4 | 0; // 0 = neutral

export interface TonedSyllable {
  syllable: string;
  tone: ToneNumber;
}

export interface Word {
  id: number;
  hanzi: string;
  pinyin: string;           // "nǐ hǎo" with diacritics
  pinyin_numbered: string;  // "ni3 hao3" numbered form
  tones: ToneNumber[];      // per-character tones
  meaning_mn: string;       // Mongolian meaning
  meaning_en: string;       // English meaning (fallback)
  hsk_level: HskLevel;
  part_of_speech: string;   // noun, verb, adj, etc.
  example_zh: string;
  example_pinyin: string;
  example_mn: string;
  audio_url?: string;
  stroke_count: number;
  created_at: string;
}

export interface WordWithProgress extends Word {
  progress?: UserWordProgress;
}

// ============================================================
// COURSE TYPES
// ============================================================
export interface Course {
  id: number;
  title_mn: string;
  title_zh: string;
  description_mn: string;
  thumbnail_url?: string;
  video_url?: string;
  hsk_level: HskLevel;
  word_count: number;
  is_published: boolean;
  created_at: string;
}

export interface Lesson {
  id: number;
  course_id: number;
  title_mn: string;
  order_index: number;
  word_count: number;
  created_at: string;
}

export interface LessonWithWords extends Lesson {
  words: Word[];
}

export interface CourseWithLessons extends Course {
  lessons: Lesson[];
}

// ============================================================
// SRS / PROGRESS TYPES
// ============================================================
export interface UserWordProgress {
  id: number;
  user_id: number;
  word_id: number;
  ease_factor: number;       // SM-2: starts at 2.5
  interval: number;          // days until next review
  repetitions: number;       // consecutive correct answers
  next_review: string;       // ISO date
  last_reviewed: string;     // ISO date
  created_at: string;
}

export type ReviewRating = 0 | 1 | 2 | 3 | 4 | 5;
// 0 = total blackout
// 1 = wrong, remembered after hint
// 2 = wrong, easy to remember
// 3 = correct, significant difficulty
// 4 = correct, small hesitation
// 5 = perfect recall

export interface ReviewResult {
  word_id: number;
  rating: ReviewRating;
  response_time_ms: number;
}

export interface StudySession {
  session_type: 'flashcard' | 'learn' | 'write' | 'test';
  results: ReviewResult[];
  total_time_ms: number;
  xp_earned: number;
}

// ============================================================
// STREAK & STATS TYPES
// ============================================================
export interface UserStreak {
  user_id: number;
  current_streak: number;
  longest_streak: number;
  last_activity_date: string;
  total_days_studied: number;
}

export interface UserStats {
  user_id: number;
  total_xp: number;
  words_learned: number;
  words_mastered: number;
  total_reviews: number;
}

export interface UserDashboard {
  user: User;
  streak: UserStreak;
  stats: UserStats;
  due_today: number;
  new_words_today: number;
}

// ============================================================
// GAME TYPES
// ============================================================
export type GameType = 'match' | 'speed_match' | 'fill_blank' | 'stroke';

export interface GameSession {
  id: number;
  user_id: number;
  game_type: GameType;
  score: number;
  accuracy: number;         // 0.0 - 1.0
  duration_seconds: number;
  words_practiced: number;
  xp_earned: number;
  created_at: string;
}

export interface MatchGameCard {
  id: string;
  word_id: number;
  type: 'hanzi' | 'meaning';
  content: string;
  is_matched: boolean;
  is_selected: boolean;
}

// ============================================================
// AUDIO TYPES
// ============================================================
export interface AudioCache {
  id: number;
  word_id: number;
  audio_key: string;        // R2 key
  audio_url: string;        // CDN URL
  created_at: string;
}

export type AudioSpeed = 'normal' | 'slow';

// ============================================================
// API RESPONSE TYPES
// ============================================================
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiError {
  error: string;
  code?: string;
  status: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  has_more: boolean;
}

// ============================================================
// ADMIN TYPES
// ============================================================
export interface AdminStats {
  total_users: number;
  total_words: number;
  total_courses: number;
  active_users_today: number;
  reviews_today: number;
}

export interface UploadUrlResponse {
  upload_url: string;
  public_url: string;
  key: string;
}
