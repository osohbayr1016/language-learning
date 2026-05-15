import type { Word } from './word';

export interface Course {
  id: number;
  title_mn: string;
  title_jp: string;
  description_mn: string;
  thumbnail_url?: string;
  video_url?: string;
  jlpt_level: number;
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

export type GameType = 'match' | 'speed_match' | 'fill_blank' | 'stroke';

export interface GameSession {
  id: number;
  user_id: number;
  game_type: GameType;
  score: number;
  accuracy: number;
  duration_seconds: number;
  words_practiced: number;
  xp_earned: number;
  created_at: string;
}

export interface MatchGameCard {
  id: string;
  word_id: number;
  type: 'kanji' | 'meaning';
  content: string;
  is_matched: boolean;
  is_selected: boolean;
}

export interface AudioCache {
  id: number;
  word_id: number;
  audio_key: string;
  audio_url: string;
  created_at: string;
}

export type AudioSpeed = 'normal' | 'slow';

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
